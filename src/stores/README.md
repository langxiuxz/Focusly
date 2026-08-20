# stores 目录说明

本阶段（Phase 2）**未引入 Pinia**，此目录不放置任何状态代码，仅保留作为未来迁移落点。

## 当前状态管理策略

共享状态由 `src/composables/` 下的领域 composable 承担：

- `useTimer` / `useTask` / `useClock` / `useStats` 即四个「store」；
- 每个 composable 内部使用 **module 级 `reactive()`** 保存状态；
- 模块只被 import 一次，因此天然是全局单例，无需额外依赖，贴合「Composition API 为核心」。

## 迁移路径

若后续引入 Pinia（需要 devtools 时间旅行、SSR 或多入口共享），
可将各 composable 内的 reactive 状态迁移为 Pinia 的 `defineStore`，本目录作为落点。
