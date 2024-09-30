export const constants = {
    DAY_NAMES: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    MONTHS: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    REGEX_PATTERN: {
        EMAIL: new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        TIME: new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/),
        DATE: new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
    },
    THEME_STORE_KEY: "theme",
    DEFAULT_WH_STUDENT_INVOICE:
        `Hi {{nickname}},

We hope you're doing well! 
This is a reminder that your due amount for {{month}}, {{year}} is {{due_amount}} TK. 
You have paid {{paid_amount}} TK. Please pay by the end of this month.
Please contact us if you have any questions.

You can get the invoice at: ${window.location.origin}/teacher/invoices/{{id}}

Thank you!`,
    DEFAULT_INVOICE_MSG_FIELDS: ["{{nickname}}", "{{whatsapp_no}}", "{{year}}", "{{month}}", "{{due_amount}}", "{{paid_amount}}", "{{id}}"]

};