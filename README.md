glsl-uniforms-editor
====================

[![](https://nodei.co/npm/glsl-uniforms-editor.png)](https://www.npmjs.com/package/glsl-uniforms-editor)

## Example

[(click to open)
![](http://i.imgur.com/LId06Xz.png)
](http://gre.github.io/glsl-uniforms-editor/example/)

Controlled / Uncontrolled Component
-----

`glsl-uniforms-editor` allows to be **Controlled**:
you have to provide `values` and an `onChange` handler
to enable the edition.
```jsx
<BezierEditor
  types={{ position: "vec2", power: "float "}}
  values={this.state.values}
  onChange={values => this.setState({ values })} />
```

`glsl-uniforms-editor` allows to be **Uncontrolled**:
just define a `defaultValues`:
```jsx
<BezierEditor
  types={{ position: "vec2", power: "float "}}
  defaultValues={{ position: [1, 2], power: 0.4 }}
  onChange={console.log.bind(console)} />
```

Used by...
----------

- [GLSL.io](http://glsl.io)
- [Diaporama Maker](https://github.com/gre/diaporama-maker)
