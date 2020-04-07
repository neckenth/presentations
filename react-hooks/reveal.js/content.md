### State MGMT with React-Hooks

Documentation:
https://reactjs.org/docs/hooks-reference.html

---

### Intro

- These hooks allow us use Functional components and _still_ manage local component state!

---

#### useState

- `React.useState(initialValue)` returns an array
- Provides access to local state value and a setter function to update it

```javascript
const [counter, setCounter] = React.useState(0);
```

---

#### ...useState II

- You can have as many of these as you need per component!
- Upon initial render, state value set to initialValue
- Updating the state value w/ the setter func to a new value --> enqueues a re-render of the component

---

#### ...useState III

- React relies on the _order_ in which hooks are called in order to decide how to render - the order must be the same for _all_ renders
  - You cannot use `useState()` inside any conditionals - if the condition changes, a hook may not be called, which would change the order
- But what about interdependent states or more complex state logic?

---

#### useReducer

- `React.useReducer()` accepts a reducer, an initialState object, and an optional init function, which can return an initial state (helpful for easily resetting component state)
- This returns current state and a dispatch method

```javascript
const [state, dispatch] = React.useReducer(reducer, initialState, [init]);
```

---

#### ...useReducer II

- The reducer passed in allows you to easily update interdependent state values from a singular action when necessary
- Instead of multiple setState calls from multiple different user interactions in your component, dispatch a single action to update those state values and create an entirely new state object

---

#### ...useReducer III

- Another benefit of useReducer - allows you to pass down `dispatch` instead of threading callbacks down the component hierarchy
  - `dispatch` acts similarly to a ref to a method, and is stable - you don't need to add it to `useEffect()` dependency array and you can trust it won't cause unnecessary re-renders

---

#### Demo

---

#### React.useReducer vs. Redux

- We're familiar w/ the action/reducer pattern because of our use of Redux for global state mgmt
  - Define actions and action creators
  - Define initial state and reducer, which defines what happens to the state when each action is dispatched
  - Map these dispatch actions to props, which we pass in to our components where state is overwritten as user interacts w/ app
- Do we need Redux for global state mgmt?

---

#### Data Flow

- "~Uni-directional" flow of data from parent to child components via props
- Data flow isn't exactly uni-directional - if parent components pass callback functions down to children via props, children can communicate with parents by invoking those callbacks.

---

- Apps can have many nested parent-child relationships and it may be necessary to manage state higher up such that components that don't have a parent-child relationship can share data.
  - Lifting state up and passing data and callbacks down to children from higher up in the component tree - threading data through in-between components ("prop-drilling")
- This can get messy and often lead to passing props through components just so they can be accessible to children and not used by the components themselves

---

#### Context

- Context is a way to avoid "prop-drilling" and pass data around different components in different branches of our app. Let's you "broadcast" data and data changes to sub-components in hierarchy.
- Context is not a new concept - pub/sub for data from higher up in the component hierarchy to components that don't have a direct relationship with those higher components
  - You can do this w/ class-based components by assigning your Context as a component's `contextType` -> access context w/ `this.context`
  - You can do this by making a Consumer component, but then you can only access your context data in your JSX code - <Context.Consumer />
  - Now you can use...`React.useContext()`

---

#### React.useContext()

1. Create a context object to "publish" data for other components --> this will give you a <Provider /> component

```javascript
const Context = React.createContext(defaultValue);
```

2. Wrap components that need access to the context data in <Provider /> to "subscribe" to the broadcasted data/updates
   - Provider accepts `value` prop to pass to consuming components wrapped in Provider

```javascript
<Context.Provider value={"something"}>
```

3. Components use the `useContext` hook to consume data from the _closest_ Provider
   - any non-consuming components between the Provider and Consumer components won't be impacted by the data flowing through

---

### Warning about context

- all consumers that are descendents of a Provider will re-render whenever the `value` prop changes
  - danger of unnecessary re-renders
  - use context for global data that's needed in many components but maybe less liable to change (locale, auth, preferred language etc)

---

#### Demo

---
