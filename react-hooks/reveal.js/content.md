### Data MGMT with React-Hooks

Documentation:
https://reactjs.org/docs/hooks-reference.html

---

#### useState

- `React.useState(initialValue)` returns an array
- Provides access to local state value and a setter function to update it

```javascript
const [counter, setCounter] = React.useState(0);
```

---

- ([value, setter] = useState(initialValue)) \* ∞ but follow the rules!
- But what about interdependent states or more complex state logic?

---

#### useReducer

- Define initial state, actions, and their impact on state in reducer
- `React.useReducer(reducer, initialState)` returns current state and a dispatch method

```javascript
const [state, dispatch] = React.useReducer(reducer, initialState, [init]);
```

---

- Declaratively update interdependent or in-sync state values from a singular action
- You can pass down `dispatch` instead of threading callbacks down the component hierarchy

---

#### Demo

---

#### React.useReducer vs. Redux

- Patterns used with React.useReducer are similar to those used in Redux but w/ less boilerplate
- Do we need Redux for global state mgmt?

---

#### Data Flow

- "~Uni-directional" flow of data from parent to child components via props
- Apps are more complex w/ many branches of components and can have many nested parent-child relationships
- Share data across hierarchy by "lifting state" / "prop drilling"

---

#### Context

- Context is a way to avoid "prop-drilling" and "broadcast" data and data changes to sub-components in hierarchy.
- Different ways to access Context outside of hooks

---

- Class-based components: assign Context as a component's `contextType` -> access context w/ `this.context`
- Wrap code in `<Context.Consumer />` -> you can only access your context data in your JSX code
- Now you can use...`React.useContext()`

---

1. Create a context object to "publish" data for other components --> this will give you a `<Provider />` (and a `<Consumer>`) component

```javascript
const Context = React.createContext(defaultValue);
```

---

2. Wrap components that need access to the context data in `<Provider />`
   - Provider accepts `value` prop to pass to consuming components wrapped

```javascript
<Context.Provider value={"something"}>
```

---

3. Components use the `useContext` hook to subscribe to and consume data from the _closest_ Provider
   - Any non-consuming components between the Provider and Consumer components won't be impacted by the data flowing through

---

### Warning about context

- All consumers that are descendents of a Provider will re-render whenever the `value` prop changes
  - Danger of unnecessary re-renders
  - Use context for data needed in many components but less liable to change (e.g. locale, auth, preferred language, dark theme)

---

#### Demo

---
