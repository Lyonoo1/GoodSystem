---
name: Global Enterprise Coding Standards
description: 融合了 Google Engineering Practices、Alibaba 阿里开发规范以及 Clean Code 的全球顶级大厂全语言通用代码规范约束。
---

# Global Enterprise Coding Standards (Google / Alibaba 顶级标准)

当你（AI）在本项目中编写、修改、重构任何语言的代码（包括但不限于 JavaScript, TypeScript, Java, Python, Go, C++, Rust 等）时，**必须严格、无条件地遵守**以下生产级、跨语言的顶级大厂规范。

## 1. 核心设计原则 (Core Principles)
- **KISS (Keep It Simple, Stupid)**：无论用什么语言，代码越简单越容易维护与查错。不要为了秀技而写出晦涩难懂的“炫技代码”。
- **DRY (Don't Repeat Yourself)**：相同的逻辑片段只要在同一项目/模块中出现两次及以上，必须将其抽取为独立的方法/函数、类或公共模块。
- **SOLID 原则**：严格遵循单一职责原则（每个类/函数只做一件特定的事）、开闭原则（对扩展开放，对修改封闭）等。
- **Fail-Fast (防错与尽早暴露)**：只要输入或状态不合法，第一时间抛出异常或返回错误状态，不要让“脏数据”在系统深处才引发崩溃。

## 2. 命名规范与语义化 (Naming Conventions)
*借鉴阿里巴巴编程规范*
- **禁止无意义拼音或缩写**：避免使用如 `getShuju()`、`a`, `b`, `c`、`tmp` 等无意义命名。所有命名必须使用准确的英文，做到“见名知意”。
- **一致的命名风格**：
  - 变量名、方法名：采用小驼峰 `camelCase`（JS/Java/C++）或 `snake_case`（Python/Rust）。
  - 类名或类型签名：大驼峰 `PascalCase`（几乎所有主流语言）。
  - 常量名：全大写加下划线 `UPPER_SNAKE_CASE`。
- **严禁魔法值 (Magic Numbers / Strings)**：代码中不应直接出现无解释的数字或字符串字面量。必须集中定义常量并附加注释。
- **布尔值变量**：以判定动词开头，如 `isDeleted`, `hasPermission`, `canExecute`, `shouldUpdate`。

## 3. 代码结构与可读性 (Readability)
*借鉴 Google Code Review 规范*
- **函数/方法长度**：单个函数/方法尽量控制在 50 行以内（不含注释）；当嵌套或缩进层级超过 3 层，必须重构并抽取 Helper 方法。
- **空行和逻辑分组**：对于无直接联系的代码块、变量声明区、逻辑执行区、返回区之间，必须用**一个空行**隔开。
- **提前返回 (Guard Clauses)**：极力避免深层嵌套的 `if-else`。使用卫语句提前处理异常情况：
  ```javascript
  // Bad
  if (condition) {
    if (isValid) {
      doSomething();
    }
  }
  
  // Good (Enterprise Standard)
  if (!condition) return;
  if (!isValid) return;
  doSomething();
  ```

## 4. 健壮性与异常处理 (Robustness & Error Handling)
- **绝不静默吞没异常**：任何语言中，捕获异常后必须有处理逻辑（记录 Log、UI提示、降级处理、或继续向上抛出），绝对不允许写出空的 `catch (Exception e) {}`。
- **空指针防御**：在使用对象前，必须判断空值。在有类型安全特性的语言中，积极使用可选链 (`?.` in JS/TS/Swift), `Optional` (Java), 或者 `if let` (Rust) 等防御手段。
- **资源清理**：打开的网络连接、数据库 Session、文件流等，无论是否发生异常，都必须在 `finally` 块中关闭，或者利用语言自带特性（如 Python 的 `with`，Java 的 `try-with-resources`，Go 的 `defer`，C++ 的 `RAII`）。

## 5. 语言特性约束 (Modern Syntax Constraint)
- **无论什么语言，全部拥抱现代语法，抛弃废弃/危险语法**。
  - **JS/TS**：绝对不允许使用 `var`，全量拥抱 `const/let`。强约束使用 `async/await` 处理异步操作，杜绝回调地狱与深层 `.then()`。
  - **Java**：优先使用基于 Stream 语法的组合式集合操作。
  - **C/C++**：禁止直接使用原始指针（raw pointers）进行复杂内存管理，必须优先采用智能指针（Smart Pointers）。
  - **Python**：必须带有 Type Hints 类型提示，不允许毫无约束的动态传参。
- **不可变性 (Immutability)**：对于不需要中途修改的数据结构，尽可能声明为不可变类型（如 `const`, `readonly`, `final`），从根源上消灭状态篡改带来的隐性 Bug。

## 6. 注释与文档 (Comments & Documentation)
- **Why 而不是 What**：代码本身应该能清晰地表明是在“做什么”（What），注释的作用是解释“**为什么要这么做**”（Why），如业务背景、妥协的设计决策、绕过某个已知 Bug 的 hack 做法。
- **API/接口文档签名**：所有对外暴露的方法或服务接口，必须使用各自语言的文档标准（如 JSDoc / JavaDoc / Doxygen / Python Docstring）详细标注：参数说明、返回值、及可能会抛出的异常。
- **TODO/FIXME**：使用 `TODO` 或 `FIXME` 时，必须简明扼要地写清需要修复的问题以及上下文原因，严禁留下孤立的 `// TODO`。

> **AI 强制自我审视指南 (Self-Reflection Check)**：每次你提交代码片段前，必须在后台进行一次“自我 Review”。如果你的代码发现使用了过时的语法、存在魔法值、异常被隐藏掉、函数嵌套极深，或者违背了上述任何一条原则，你应该立刻停下并主动重构它！
