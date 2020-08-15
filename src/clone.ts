export function clone(toClone: any, options?: CloneOptions, instantiator?: { [className: string]: () => any }, alreadyCloned: WeakMap<any, any> = new WeakMap): any {
  // if we have an array clone it and its values
  if (toClone instanceof Array) {
    let cloned = Array(toClone.length)

    for (let i = 0; i < toClone.length; i++) {
      let clonedElement = clone(toClone[i], options, instantiator, alreadyCloned)
      cloned[i] = clonedElement
    }

    return cloned
  }

  // support for cloning Date objects
  if (toClone instanceof Date) {
    return new Date(toClone.getTime())
  }
  
  // if we already cloned that exact object do not clone again but use that exact object
  // that was already cloned
  if (typeof toClone == 'object' && toClone !== null) {
    let cloned: any = undefined

    if (alreadyCloned.has(toClone)) {
      return alreadyCloned.get(toClone)
    }
    
    // if we got an instantiator look if it contains the class name of the object to clone
    if (instantiator) {
      let className: string
      if (typeof toClone.className == 'string') {
        className = toClone.className
      }
      else {
        className = toClone.constructor.name
      }
      
      if (className in instantiator) {
        cloned = instantiator[className]()
      }
    }

    // if there was no instantiator or if there was one but it did not containt that object's class name
    // create a new plain empty object
    if (cloned == undefined) {
      cloned = {}
    }

    // store it in the already cloned map
    alreadyCloned.set(toClone, cloned)

    // clone every property of the object to clone
    for (let prop of Object.keys(toClone)) {
      let propOptions = options && prop in options ? options[prop] : prop
      let propValue = toClone[prop]

      // by default the cloning algorithm only clones shallow. if you want it to clone deep you have to
      // give a property to the options object which has the same name and either contains a simple true
      // or another object with more instructions.
      if (propOptions === true || typeof propOptions == 'object' && propOptions !== null) {
        let clonedValue = clone(propValue, typeof propOptions == 'object' ? propOptions : undefined, instantiator, alreadyCloned)
        cloned[prop] = clonedValue
      }
      // if we have an array clone it shallow
      else if (propValue instanceof Array) {
        cloned[prop] = propValue.slice()
      }
      // any thing just assign
      else {
        cloned[prop] = propValue
      }
    }

    return cloned
  }

  if (typeof toClone == 'string') {
    // prepending an empty string will cause the string to be cloned
    return toClone
  }

return toClone
}

export interface CloneOptions {
  [propertyName: string]: boolean|CloneOptions
}
