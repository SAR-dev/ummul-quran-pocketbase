routerAdd("GET", "/api/hello/:name", (c) => {
    let name = c.pathParam("name")

    return c.json(200, { "message": "Hello " + name })
})

routerAdd("POST", "/api/class-logs/create", (c) => {
    $app.dao().runInTransaction((txDao) => {
        const payload = $apis.requestInfo(c).data

        const collection = $app.dao().findCollectionByNameOrId("class_logs")

        const record = new Record(collection)

        record.set("student", payload.student)
        record.set("topic", payload.topic)
        record.set("start_at", payload.start_at)
        record.set("finish_at", payload.finish_at)

        txDao.saveRecord(record)

        const canAccess = $app.dao().canAccessRecord(record, $apis.requestInfo(c), record.collection().createRule)
        if (!canAccess) {
            throw new ForbiddenError()
        }
    })

    return c.json(200, { "message": "Class log created" })
})

routerAdd("POST", "/api/class-logs/start", (c) => {
    $app.dao().runInTransaction((txDao) => {
        
    })

    return c.json(200, { "message": "Class log started" })
})

routerAdd("POST", "/api/class-logs/update", (c) => {
    $app.dao().runInTransaction((txDao) => {
        
    })

    return c.json(200, { "message": "Class log started" })
})

routerAdd("POST", "/api/class-logs/complete", (c) => {
    $app.dao().runInTransaction((txDao) => {
        
    })

    return c.json(200, { "message": "Class log started" })
})



