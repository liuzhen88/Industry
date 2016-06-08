// TODO: load those enums from enums db collections
module.exports = {
    RoleEnum: {
        "ADMIN": "管理员",
        "PLANNING": "生产管理部",
        "DIRECTOR": "车间主任",
        "TEAM_LEADER": "班组长",
        "WORKER": "操作工"
    },
    StatusEnum: {
        NOT_PROCESSED: "未处理",
        PROCESSED: "已处理",
        EDITING: "编辑中",
        AUDITING: "审核中",
        AUDITED: "审核通过",
        REJECTED: "审核未通过",
        PREPARING: "调产中",
        EXECUTING: "执行中",
        FINISHED: "完工",
        CONFIRMED: "完工确认"
    }
};