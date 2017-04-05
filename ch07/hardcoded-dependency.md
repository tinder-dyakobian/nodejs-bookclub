# Hardcoded Dependency
----------------------

**Definition**: Obtained when a client module explicitly loads another module using `require()`. Be careful when hardcoding dependencies with stateful instances, as this would limit the reusabilitiy of our module. 

### Pros & Cons
**Pros**
- Immediately intuitive organization, easy to understand debug, where each module initializes and wires itself without any external intervention.
**Cons**
- Hardcoding the dep on a stateful instance limits the possibility of wiring the module against other instances, makes it less reusable and harder to test.

### Holy Grail for Module Writing
1. Modules should have a **very specific purpose**. Don't aim to build a large framework (YAGNI).
2. **Naming Conventions**
    - A base filename should exactly match the name of its default export. (AirBnb 22.6)
    - Use camelCase when you export-default a function. Your filename should be identical to your function's name. (AirBnb 22.7)
    -  Use PascalCase when you export a constructor / class / singleton / function library / bare object. (AirBnb 22.8)
    -  Use kibob-case for folders and npm package names, *generally* favour clear and "boring" names for better discoverability and code clarity.
    -  Prefix controller methods with a simple verb(i.e. jobCreated) and post fix event names with past tense verb (*i.e.* jobCreated)
3. **Small Focus**: Strip away code that doesn't belong in the module, keeping the entry point focused and narrow. 
4. **Discoverability**
    - Include a README.md in your module folder
    - Comment code, dont overdo comments it takes too long, be concise
5. **Readability**
    - `module.exports` on the bottom of the page.
6. **Avoid Global State**: Globals, static fields, and singletons are dangerous in module code, and should be avoided.  If two modules both depend on `foo-bar`, and both of them mutate the global state, only one would succeed. 

### Examples 
1. Page iterator
2. DynamoDB Rate Limiter

## Testing
Don't test private functions

How do you guys keep your module testable?


"If you think its going to be to hard to test your module, then you should break it into smaller testable modules."

"Add a utils file inside your module folder, but prefer coming up with a reusable abstraction."

### Socratic Seminar
1. Talk to each other, try to refer to evidence from the text
2. Ask questions if you do not understand what someone has said.
3. Don't raise your hands, but monitor airtime and don’t interrupt.

### References
[AirBnb Style Guide] (https://github.com/airbnb/javascript)
[Module Best Practices](https://github.com/mattdesl/module-best-practices)

### Learn More
[Export Interface Design Pattern] (https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40)