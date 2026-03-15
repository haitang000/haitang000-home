(function () {
    "use strict";

    // 保存原始标题，用于后续恢复
    const originalTitle = document.title;

    // 存储定时器 ID，防止多个定时器冲突
    let timeoutId;

    // 处理页面可见性变化的逻辑
    function handleVisibilityChange() {
        // 清除上一次可能存在的延时器
        clearTimeout(timeoutId);

        if (document.hidden) {
            // 当页面不可见时，设置标题
            document.title = "别走太远了啊喂...";
        } else {
            // 当页面可见时，先设置一个提示标题
            document.title = "好耶，回来啦！ヾ(•ω•`)o";
            // 延时 2 秒后恢复原始标题
            timeoutId = setTimeout(() => {
                document.title = originalTitle;
            }, 2000);
        }
    }

    // 页面即将卸载时的清理逻辑
    function beforeUnloadListener() {
        // 移除可见性变化的事件监听器，避免内存泄漏
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    // 绑定页面可见性变化的事件
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 在页面卸载之前移除相关事件监听器
    window.addEventListener("beforeunload", beforeUnloadListener);
})();

// 默哀模式
const anniversaries = {
    4.4: "清明节",
    5.12: "汶川大地震纪念日",
    7.7: "中国人民抗日战争纪念日",
    9.18: "九·一八事变纪念日",
    12.13: "南京大屠杀死难者国家公祭日",
};

function checkDays() {
    const myDate = new Date();
    const mon = myDate.getMonth() + 1;
    const date = myDate.getDate();
    const key = `${mon}.${date}`;
    if (Object.prototype.hasOwnProperty.call(anniversaries, key)) {
        console.log(`今天是${anniversaries[key]}`);
        const gray = document.createElement("style");
        gray.innerHTML = "html{filter: grayscale(100%)}";
        document.head.appendChild(gray);
    }
}

setTimeout(checkDays(), 0);

var HoldLog = console.log;
console.log = function () { };
queueMicrotask(() => {
    const Log = function () {
        HoldLog.apply(console, arguments);
    };
    const ascll = [
        `系统`,
        `调用前置摄像头拍照成功，识别为【欸！🤓☝️】.`,
        `Photo captured: `,
        `🤓☝️`,
    ];
    setTimeout(
        Log.bind(
            console,
            `%c ${ascll[0]} %c ${ascll[1]} %c \n${ascll[2]} %c\n${ascll[3]}\n`,
            "color:white;background-color:#4fd953",
            "",
            "",
            "font-size:450%"
        ),
        200
    );

    setTimeout(
        Log.bind(
            console,
            "%c WELCOME %c 亻尔女子🤓☝️",
            "color:white;background-color:#4f90d9",
            ""
        ),
        250
    );

    setTimeout(
        Log.bind(
            console,
            "%c ⚡ Powered by haitang000 %c 你正在访问 haitang000 的个人网站",
            "color:white;background-color:#f0ad4e",
            ""
        ),
        300
    );

    setTimeout(
        Log.bind(
            console,
            "%c QwQ %c 你已打开控制台，因为你看到了我了（",
            "color:white;background-color:#4f90d9",
            ""
        ),
        350
    );


});
