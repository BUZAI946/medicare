package com.medicare.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SPA 路由 — 非 API 请求全部转发到 index.html，由 Vue Router 处理
 */
@Controller
public class SpaController {

    @RequestMapping(value = "/{path:[^.]+}")
    public String forward() {
        return "forward:/index.html";
    }
}
