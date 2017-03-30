# Chapter 7 - Wiring Modules

**Goal**: Analyze the various approaches for wiring modules and highlight their strengths and weaknesses so that we can rationally choose and mix them together depending on the balance of **simplicity**, **reusability**, and **extensibility** that we want to obtain.

Relevant Patterns:
1. Hardcoded dependency 
2. Dependency Injection
3. Service locator
4. Dependency Injection containers

### Background
#### Cohesion and Coupling
**Cohesion**: A measure of the correlation between the functionalities of a component. A module that does *only one thing*, where all its parts contribute to that one single task has a *high cohesion*. 
![Low vs. High Cohesion] (http://i.imgur.com/32iUQTf.png)


**Coupling**: How related are two classes / modules and how dependent they are on each other. Being low coupling would mean that changing something major in one class should not affect the other.


The desirable scenario is to have a *high cohesion* and a *low coupling*, which usually results in more understandable, reusable, and extensible modules.


**Unix Philosophy**: building small programs that do one thing, do it well, and compose easily with other programs.


*Keep In Mind* YAGNI (You Aren't Gonna Need It): Don't add functionality until deemed necessary.

#### See
[SO Cohesion Coupling](http://stackoverflow.com/questions/3085285/cohesion-coupling)


[YAGNI Wiki](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)


