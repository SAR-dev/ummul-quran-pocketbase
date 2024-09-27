routerAdd("POST", "/api/send-wh-message", (c) => {
    const payload = $apis.requestInfo(c).data

    // allow admin only

    const admin = !!c.get("admin")
    if(!admin) throw ForbiddenError()

    if(!["TEACHER", "STUDENT"].includes(payload.type)) throw ForbiddenError();

    const data = {
        id: "",
        nickname: "",
        whatsapp_no: "",
        year: "",
        month: "",
        due_amount: "",
        paid_amount: ""
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (payload.type == "TEACHER") {
        const record = $app.dao().findFirstRecordByFilter(
            "teacher_invoices",
            `id = '${payload.id}'`
        )
        $app.dao().expandRecord(record, ["teacher"], null)
        
        if (record == null) {
            throw new ForbiddenError()
        }
        
        data.nickname = record.publicExport().expand.teacher.publicExport().nickname
        data.whatsapp_no = record.publicExport().expand.teacher.publicExport().mobile_no.replace(/\D/g, '')
        data.year = record.publicExport().year
        data.month = months[record.publicExport().month - 1]
        data.due_amount = record.publicExport().due_amount
        data.id = record.publicExport().id
    }

    if (payload.type == "STUDENT") {
        const record = $app.dao().findFirstRecordByFilter(
            "student_invoices",
            `id = '${payload.id}'`
        )
        $app.dao().expandRecord(record, ["student"], null)

        if (record == null) {
            throw new ForbiddenError()
        }

        data.nickname = record.publicExport().expand.student.publicExport().nickname
        data.whatsapp_no = record.publicExport().expand.student.publicExport().mobile_no.replace(/\D/g, '')
        data.year = record.publicExport().year
        data.month = months[record.publicExport().month - 1]
        data.due_amount = record.publicExport().due_amount
        data.id = record.publicExport().id
    }

// Hi {{nickname}},

// We hope you're doing well! 
// This is a reminder that your due amount for {{month}}, {{year}} is {{due_amount}} TK. 
// You have paid {{paid_amount}} TK. Please pay by the end of this month.
// Please contact us if you have any questions.

// Thank you!

    const message = payload.message
        .replaceAll("{{nickname}}", data.nickname)
        .replaceAll("{{whatsapp_no}}", data.whatsapp_no)
        .replaceAll("{{year}}", data.year)
        .replaceAll("{{month}}", data.month)
        .replaceAll("{{due_amount}}", data.due_amount)
        .replaceAll("{{paid_amount}}", data.paid_amount)
        .replaceAll("{{id}}", data.id)

    let error = true
    try {
        const res = $http.send({
            url: "https://high-rivalee-sar-dev-b47399e6.koyeb.app/api/sendText",
            method: "POST",
            body: JSON.stringify({
                "chatId": `${data.whatsapp_no}@c.us`,
                "text": `${message}`,
                "session": "default"
            }),
            headers: { "content-type": "application/json" },
            timeout: 120 // in seconds
        });
        if (res.statusCode === 201) error = false;
    } catch (_) {}

    const updateData = {
        table: "",
        id: "",
        status: ""
    }
    updateData.id = data.id
    if(payload.type == "TEACHER") updateData.table = "teacher_invoices";
    if(payload.type == "STUDENT") updateData.table = "student_invoices";
    if(error) updateData.status = "ERROR"
    if(!error) updateData.status = "SUCCESS"

    const record = $app.dao().findRecordById(updateData.table, updateData.id)
    record.set("status", updateData.status)
    $app.dao().saveRecord(record)

    c.json(200, { "message": "Request processed!" });
});


routerAdd("POST", "/api/class-logs/create-by-routine", (c) => {
    const payload = $apis.requestInfo(c).data

    // helpers

    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const getDatesByWeekday = ({
        start_date,
        finish_date,
        weekday_index,
        start_at,
        finish_at,
        offset_hh_mm
    }) => {
        const result = [];
        let currentDate = new Date(start_date);
        let finishDate = new Date(finish_date);

        while (currentDate <= finishDate) {
            const dayIndex = currentDate.getDay();

            if (weekday_index === dayIndex) {
                result.push({
                    start_at: `${currentDate.toISOString().slice(0, 10)} ${start_at}:00.000${offset_hh_mm}`,
                    finish_at: `${currentDate.toISOString().slice(0, 10)} ${finish_at}:00.000${offset_hh_mm}`,
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    };

    // validation start

    const errorRoutines = payload.routine.filter(routine =>
        Number(routine.finish_at?.replace(":", "")) != 0 &&
        (Number(routine.finish_at?.replace(":", "")) < Number(routine.start_at.replace(":", "")))
    )

    if (errorRoutines.length > 0) {
        const errorDays = errorRoutines.map(e => dayNames[e.weekday_index]).join(", ")
        throw new ForbiddenError("Fix class times for " + errorDays)
    }

    const start_date = new Date(payload.start_date)
    const finish_date = new Date(payload.finish_date)
    const yesterday_date = new Date(new Date().setDate(new Date().getDate() - 1))

    if ((finish_date.getTime() <= start_date.getTime()) || start_date.getTime() < yesterday_date.getTime()) {
        throw new ForbiddenError("Fix date range.")
    }

    const days_difference = (finish_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24);
    if (days_difference > 366) {
        throw new ForbiddenError("You can create routine for maximum 1 year")
    }

    // validation finish

    const payloads = payload.routine.flatMap(routine =>
        getDatesByWeekday({
            start_date: payload.start_date,
            finish_date: payload.finish_date,
            weekday_index: routine.weekday_index,
            start_at: routine.start_at,
            finish_at: routine.finish_at,
            offset_hh_mm: payload.offset_hh_mm
        })
    );

    const collection = $app.dao().findCollectionByNameOrId("class_logs")

    $app.dao().runInTransaction((txDao) => {
        if (payload.new_routine) {
            const start_at_str = `${start_date.toISOString().slice(0, 10)} 00:00:00.000${payload.offset_hh_mm}`
            // const finish_at_str = `${finish_date.toISOString().slice(0, 10)} 00:00:00.000${payload.offset_hh_mm}`;

            const records = $app.dao().findRecordsByFilter(
                "class_logs",
                // `start_at >= '${start_at_str}' && start_at <= '${finish_at_str}' && completed = false`
                `start_at >= '${start_at_str}' && completed = false`
            )
            for (let record of records) {
                txDao.deleteRecord(record)
            }
        }
        let checkData = null;

        for (let data of payloads) {
            const record = new Record(collection)

            record.set("student", payload.student)
            record.set("start_at", data.start_at)
            record.set("finish_at", data.finish_at)

            if (checkData == null) checkData = record;

            txDao.saveRecord(record)
        }

        const teacherByStudent = $app.dao().findFirstRecordByData("students", "id", payload.student).get("teacher")
        const teacherByAuth = $app.dao().findFirstRecordByData("teachers", "user", c.get("authRecord").get("id")).get("id")

        const canAccess = teacherByStudent == teacherByAuth
        if (!canAccess) {
            throw new ForbiddenError()
        }
    })

    return c.json(200, { "message": "Class log created" })
})

routerAdd("POST", "/api/class-logs/create-by-dates", (c) => {
    const payload = $apis.requestInfo(c).data

    // helpers

    const getDate = ({
        date,
        start_at,
        finish_at,
        offset_hh_mm
    }) => {
        const currentDate = new Date(date)
        return {
            start_at: `${currentDate.toISOString().slice(0, 10)} ${start_at}:00.000${offset_hh_mm}`,
            finish_at: `${currentDate.toISOString().slice(0, 10)} ${finish_at}:00.000${offset_hh_mm}`,
        };
    };

    // validation start

    const errorRoutines = payload.routine.filter(routine =>
        Number(routine.finish_at?.replace(":", "")) != 0 &&
        (Number(routine.finish_at?.replace(":", "")) < Number(routine.start_at.replace(":", "")))
    )

    if (errorRoutines.length > 0) {
        const errorDays = errorRoutines.map(e => dayNames[e.weekday_index]).join(", ")
        throw new ForbiddenError("Fix class times for " + errorDays)
    }

    // validation finish

    const payloads = payload.routine.flatMap(routine =>
        getDate({
            date: routine.date,
            start_at: routine.start_at,
            finish_at: routine.finish_at,
            offset_hh_mm: payload.offset_hh_mm
        })
    );
    const collection = $app.dao().findCollectionByNameOrId("class_logs")

    $app.dao().runInTransaction((txDao) => {
        let checkData = null;

        for (let data of payloads) {
            const record = new Record(collection)

            record.set("student", payload.student)
            record.set("start_at", data.start_at)
            record.set("finish_at", data.finish_at)

            if (checkData == null) checkData = record;

            txDao.saveRecord(record)
        }

        const teacherByStudent = $app.dao().findFirstRecordByData("students", "id", payload.student).get("teacher")
        const teacherByAuth = $app.dao().findFirstRecordByData("teachers", "user", c.get("authRecord").get("id")).get("id")

        const canAccess = teacherByStudent == teacherByAuth
        if (!canAccess) {
            throw new ForbiddenError()
        }
    })

    return c.json(200, { "message": "Class log created" })
})

routerAdd("POST", "/api/class-logs/start", (c) => {
    const payload = $apis.requestInfo(c).data

    const id = payload.id
    if (!id) throw ForbiddenError();

    // helpers

    function getCurrentTime() {
        const now = new Date();
        const date = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const time = now.toISOString().slice(11, 23); // "HH:mm:ss.SSS"
        return `${date} ${time}Z`;
    }

    const record = $app.dao().findRecordById("class_logs", id)

    $app.dao().runInTransaction((txDao) => {
        record.set("started", true)
        record.set("start_at", getCurrentTime())

        txDao.saveRecord(record)

        const teacherByStudent = $app.dao().findFirstRecordByData("students", "id", record.get("student")).get("teacher")
        const teacherByAuth = $app.dao().findFirstRecordByData("teachers", "user", c.get("authRecord").get("id")).get("id")

        const canAccess = teacherByStudent == teacherByAuth
        if (!canAccess) {
            throw new ForbiddenError()
        }

    })

    return c.json(200, { "message": "Class log started" })
})

routerAdd("POST", "/api/class-logs/finish", (c) => {
    const payload = $apis.requestInfo(c).data

    const id = payload.id
    if (!id) throw ForbiddenError();

    // helpers

    function getCurrentTime() {
        const now = new Date();
        const date = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const time = now.toISOString().slice(11, 23); // "HH:mm:ss.SSS"
        return `${date} ${time}Z`;
    }

    const record = $app.dao().findRecordById("class_logs", id)

    const student = $app.dao().findRecordById("students", record.get("student"))
    const monthly_package = $app.dao().findRecordById("monthly_packages", student.get("monthly_package"))

    $app.dao().runInTransaction((txDao) => {
        record.set("cp_teacher", student.get("teacher"))
        record.set("cp_class_mins", monthly_package.get("class_mins"))
        record.set("cp_teachers_price", monthly_package.get("teachers_price"))
        record.set("cp_students_price", monthly_package.get("students_price"))
        record.set("started", true)
        record.set("completed", true)
        record.set("finish_at", getCurrentTime())

        txDao.saveRecord(record)

        const teacherByStudent = $app.dao().findFirstRecordByData("students", "id", record.get("student")).get("teacher")
        const teacherByAuth = $app.dao().findFirstRecordByData("teachers", "user", c.get("authRecord").get("id")).get("id")

        const canAccess = teacherByStudent == teacherByAuth
        if (!canAccess) {
            throw new ForbiddenError()
        }

    })

    return c.json(200, { "message": "Class log finished" })
})

routerAdd("POST", "/api/generate-invoices", (c) => {
    const payload = $apis.requestInfo(c).data

    // allow admin only

    const admin = !!c.get("admin")
    if (!admin) throw ForbiddenError()

    // check if the year and month is in past

    const year = Number(payload.year)
    const month = Number(payload.month)

    if (!year || !month || year > new Date().getFullYear() || month >= new Date().getMonth() + 1) {
        throw new ApiError(500, "You need to select a past date.", {});
    }

    // check if already generated

    const student_invoices = $app.dao().findRecordsByFilter(
        "student_invoices",
        `year = '${year}' && month = '${month}'`
    )
    if (student_invoices.length > 0) throw new ApiError(500, "This month has already been Invoiced", {});

    const teacher_invoices = $app.dao().findRecordsByFilter(
        "teacher_invoices",
        `year = '${year}' && month = '${month}'`
    )
    if (teacher_invoices.length > 0) throw new ApiError(500, "This month has already been Invoiced", {});


    $app.dao().runInTransaction((txDao) => {
        // delete incomplete classes of the year and month

        const cd = new Date(year, month - 1, 1);
        const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

        const start = `${cd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const end = `${nd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const records = $app.dao().findRecordsByFilter(
            "class_logs",
            `start_at >= '${start}' && start_at < '${end}' && completed = false`
        )
        for (let record of records) {
            txDao.deleteRecord(record)
        }

        const classLogs = $app.dao().findRecordsByFilter(
            "class_logs",
            `start_at >= '${start}' && start_at < '${end}' && completed = true`
        )

        // insert into student invoices

        const student_collection = $app.dao().findCollectionByNameOrId("student_invoices")
        const students = $app.dao().findRecordsByFilter("students", `id != '0'`)
        for (let student of students) {
            const record = new Record(student_collection)

            const due_amount = classLogs.filter(e => e.publicExport().student == student.get("id")).reduce((sum, record) => sum + record.publicExport().cp_students_price, 0);

            record.set("student", student.get("id"))
            record.set("year", year)
            record.set("month", month)
            record.set("due_amount", due_amount)

            txDao.saveRecord(record)
        }

        // insert into teacher invoices

        const teacher_collection = $app.dao().findCollectionByNameOrId("teacher_invoices")
        const teachers = $app.dao().findRecordsByFilter("teachers", `id != '0'`)
        for (let teacher of teachers) {
            const record = new Record(teacher_collection)

            const due_amount = classLogs.filter(e => e.publicExport().cp_teacher == teacher.get("id")).reduce((sum, record) => sum + record.publicExport().cp_teachers_price, 0);

            record.set("teacher", teacher.get("id"))
            record.set("year", year)
            record.set("month", month)
            record.set("due_amount", due_amount)

            txDao.saveRecord(record)
        }
    })

    return c.json(200, { "message": "Invoices Issued" })
})

routerAdd("GET", "/api/get-student-invoices", (c) => {
    const userId = c.get("authRecord").get("id");

    const invoices = $app.dao().findRecordsByFilter(
        "student_invoices",
        `student.user.id = '${userId}'`
    )

    const res = []

    for (let invoice of invoices) {
        const year = invoice.get("year")
        const month = invoice.get("month")
        const cd = new Date(year, month - 1, 1);
        const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

        const start = `${cd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const end = `${nd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const records = $app.dao().findRecordsByFilter(
            "class_logs",
            `start_at >= '${start}' && start_at < '${end}' && completed = true`
        )

        res.push({
            "id": invoice.get("id"),
            "year": invoice.get("year"),
            "month": invoice.get("month"),
            "paid": invoice.get("paid"),
            "total_classes": records.length,
            "due_amount": invoice.get("due_amount")
        })
    }

    return c.json(200, res)
})

routerAdd("GET", "/api/get-teacher-invoices", (c) => {
    const userId = c.get("authRecord").get("id");

    const invoices = $app.dao().findRecordsByFilter(
        "teacher_invoices",
        `teacher.user.id = '${userId}'`
    )

    const res = []

    for (let invoice of invoices) {
        const year = invoice.get("year")
        const month = invoice.get("month")
        const cd = new Date(year, month - 1, 1);
        const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

        const start = `${cd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const end = `${nd.toISOString().slice(0, 10)} 00:00:00.000Z`
        const records = $app.dao().findRecordsByFilter(
            "class_logs",
            `start_at >= '${start}' && start_at < '${end}' && completed = true`
        )

        res.push({
            "id": invoice.get("id"),
            "year": invoice.get("year"),
            "month": invoice.get("month"),
            "paid": invoice.get("paid"),
            "total_classes": records.length,
            "due_amount": invoice.get("due_amount")
        })
    }

    return c.json(200, res)
})

routerAdd("GET", "/api/get-student-invoices/:id", (c) => {
    const userId = c.get("authRecord").get("id");

    // filter by matching student and id

    const invoice = $app.dao().findFirstRecordByFilter(
        "student_invoices",
        `student.user.id = '${userId}' && id = '${c.pathParam("id")}'`
    )

    if (invoice == null) {
        throw new ForbiddenError()
    }

    const year = invoice.get("year")
    const month = invoice.get("month")
    const cd = new Date(year, month - 1, 1);
    const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

    const start = `${cd.toISOString().slice(0, 10)} 00:00:00.000Z`
    const end = `${nd.toISOString().slice(0, 10)} 00:00:00.000Z`
    const records = $app.dao().findRecordsByFilter(
        "class_logs",
        `start_at >= '${start}' && start_at < '${end}' && completed = true`
    )
    $app.dao().expandRecords(records, ["student"], null)

    const logs = []
    records.forEach(record => logs.push({
        class_mins: record.publicExport().cp_class_mins,
        students_price: record.publicExport().cp_students_price
    }))

    // Map to store unique combinations of class_mins and students_price
    const uniqueLogsMap = new Map();

    logs.forEach(log => {
        const key = `${log.class_mins}-${log.students_price}`;
        if (uniqueLogsMap.has(key)) {
            uniqueLogsMap.set(key, uniqueLogsMap.get(key) + 1);
        } else {
            uniqueLogsMap.set(key, 1);
        }
    });

    // Convert the map into an array of unique combinations and their counts
    const uniqueLogsArray = Array.from(uniqueLogsMap, ([key, count]) => {
        const [class_mins, students_price] = key.split('-');
        return { class_mins: Number(class_mins), students_price: Number(students_price), total_classes: count };
    });

    return c.json(200, {
        "id": invoice.get("id"),
        "year": invoice.get("year"),
        "month": invoice.get("month"),
        "paid": invoice.get("paid"),
        "class_logs": uniqueLogsArray,
        "due_amount": invoice.get("due_amount")
    })
})

routerAdd("GET", "/api/get-teacher-invoices/:id", (c) => {
    const userId = c.get("authRecord").get("id");

    // filter by matching teacher and id

    const invoice = $app.dao().findFirstRecordByFilter(
        "teacher_invoices",
        `teacher.user.id = '${userId}' && id = '${c.pathParam("id")}'`
    )

    if (invoice == null) {
        throw new ForbiddenError()
    }

    const year = invoice.get("year")
    const month = invoice.get("month")
    const cd = new Date(year, month - 1, 1);
    const nd = new Date(new Date(year, month - 1, 1).setMonth(new Date(year, month - 1, 1).getMonth() + 1));

    const start = `${cd.toISOString().slice(0, 10)} 00:00:00.000Z`
    const end = `${nd.toISOString().slice(0, 10)} 00:00:00.000Z`
    const records = $app.dao().findRecordsByFilter(
        "class_logs",
        `start_at >= '${start}' && start_at < '${end}' && completed = true`
    )
    $app.dao().expandRecords(records, ["student"], null)

    const logs = []
    records.forEach(record => logs.push({
        class_mins: record.publicExport().cp_class_mins,
        teachers_price: record.publicExport().cp_teachers_price
    }))

    // Map to store unique combinations of class_mins and students_price
    const uniqueLogsMap = new Map();

    logs.forEach(log => {
        const key = `${log.class_mins}-${log.teachers_price}`;
        if (uniqueLogsMap.has(key)) {
            uniqueLogsMap.set(key, uniqueLogsMap.get(key) + 1);
        } else {
            uniqueLogsMap.set(key, 1);
        }
    });

    // Convert the map into an array of unique combinations and their counts
    const uniqueLogsArray = Array.from(uniqueLogsMap, ([key, count]) => {
        const [class_mins, teachers_price] = key.split('-');
        return { class_mins: Number(class_mins), teachers_price: Number(teachers_price), total_classes: count };
    });

    return c.json(200, {
        "id": invoice.get("id"),
        "year": invoice.get("year"),
        "month": invoice.get("month"),
        "paid": invoice.get("paid"),
        "class_logs": uniqueLogsArray,
        "due_amount": invoice.get("due_amount")
    })
})
