### event 事件注册命名规范

event 事件绝大多数都是在 models 文件夹中使用 故文件名即可识别默认文件夹名为 models。若在 utils 等文件夹中使用文件名需拼接上文件夹名。
[文件名].[唯一识别]?.[方法名]

### 示例及解释

```
  //head.js 注册
  event.on('head.toggleActivePanel', (data) => {
    toggleActivePanel(data)
  })
  //root.js 使用
  event.fire('head.toggleActivePanel', 'projects')
```

event.on: 注册事件
head.toggleActivePanel - head.js 内的 toggleActivePanel 事件
event.fire: 调用事件

### 工程下 event 事件总览及作用

event 注册时需要在此目录下进行追加

- head.toggleActivePanel - 切换工程头部激活的面板对应的 tab
