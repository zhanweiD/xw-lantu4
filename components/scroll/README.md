需要锚点滚动时，`children`使用函数值，函数的参数是`scrollTo`方法

```js
<Scroll className="h100p">
  {({scrollTo}) => (
    <>
      <Section name={t('bbb')}>
        <div onClick={() => {
          scrollTo('#customId')
        }}>eee</div>
      </Section>
      <div id="customId">带有id属性的元素</div>
    </>
  )}
</Scroll>
```

需要获取触底滚动，可以用到 `children` 使用函数值，函数的参数是 `handler`, `handler.onScrollEnd` 为接触到页面底部方法，方法返回值为 `布尔类型值`。
```js
// 触底加载
const onScrollEnd = v => {
  if (v) console.log('页面接触到底部了，这时候应该发送请求获取数据～')
}

<Scroll className="h100p">
  {({handler}) => {
    // 绑定事件
    handler.onScrollEnd = onScrollEnd
    return <div>xxxxxx</div>
  }}
</Scroll>
```