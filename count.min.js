!(function () {
    // 输出欢迎信息到控制台
    console.info("welcome to use analytics_with_cloudflare url: https://github.com/yestool/analytics_with_cloudflare");

    // 获取当前脚本元素
    const scriptElement = document.currentScript;

    // 从当前脚本的属性中获取 base-url、page_pv_id 和 page_uv_id
    let baseUrl = scriptElement.getAttribute("data-base-url"),
        pagePvId = scriptElement.getAttribute("data-page-pv-id"),
        pageUvId = scriptElement.getAttribute("data-page-uv-id");

    // 初始化一个版本信息对象
    const WebViso = { version: "0.0.0" };

    // 设置默认的 baseUrl
    let apiBaseUrl = "https://count.kafuchino.top";

    // 设置默认的 PV 和 UV ID
    WebViso.page_pv_id = "cf_page_pv";
    WebViso.page_uv_id = "cf_page_uv";

    // 如果脚本的 base-url 属性存在，则覆盖默认的 baseUrl
    if (baseUrl) {
        apiBaseUrl = baseUrl;
    }

    // 如果脚本的 page_pv_id 和 page_uv_id 属性存在，则覆盖默认的 ID
    if (pagePvId) {
        WebViso.page_pv_id = pagePvId;
    }
    if (pageUvId) {
        WebViso.page_uv_id = pageUvId;
    }

    // 定义初始化函数，用于发送请求并显示 PV 和 UV 数据
    WebViso.init = async function () {
        // 获取当前页面的 URL 信息
        const locationInfo = getLocation(window.location.href);

        // 获取页面中显示 PV 和 UV 数据的元素
        const pvElement = document.getElementById(WebViso.page_pv_id);
        const uvElement = document.getElementById(WebViso.page_uv_id);

        // 构建请求参数，包括页面路径、主机名、引用来源等
        const visitData = {
            url: locationInfo.pathname,
            hostname: locationInfo.hostname,
            referrer: document.referrer
        };

        // 如果页面中存在 PV 和 UV 元素，标记这些数据需要获取
        if (pvElement) visitData.pv = true;
        if (uvElement) visitData.uv = true;

        // 发送 POST 请求到服务器，获取 PV 和 UV 数据
        await fetch(`${apiBaseUrl}/api/visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitData)
        })
        .then(response => response.json())
        .then(data => {
            // 如果服务器返回的结果不是 OK，则输出错误信息
            if (data.ret !== "OK") {
                console.error("WebViso.init error", data.message);
                return;
            }

            // 将返回的 PV 和 UV 数据填充到页面元素中
            const resultData = data.data;
            if (pvElement) pvElement.innerText = resultData.pv;
            if (uvElement) uvElement.innerText = resultData.uv;
        })
        .catch(error => {
            console.log("WebViso.init fetch error", error);
        });
    };

    // 定义辅助函数，用于解析 URL
    const getLocation = function (url) {
        const linkElement = document.createElement("a");
        linkElement.href = url;
        return linkElement;
    };

    // 检查是否在浏览器环境下执行，并初始化 WebViso
    if (typeof window !== "undefined") {
        WebViso.init();
        window.WebViso = WebViso;
    }
})();
