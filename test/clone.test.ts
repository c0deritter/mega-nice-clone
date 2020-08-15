import { expect } from 'chai'
import 'mocha'
import { clone } from '../src/clone'

describe('clone', function() {
  it('should clone a simple value', function() {
    expect(clone(1)).to.equal(1)
    expect(clone('a')).to.equal('a')
    expect(clone(true)).to.equal(true)
  })

  it('should shallow clone an array of simple values', function() {
    let orig = [ 1, 2, 3, 4 ]
    let cloned = clone(orig)
    
    expect(cloned).to.deep.equal(orig)

    orig.push(5)
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should clone an object consisting of simple values', function() {
    let orig = {
      a: 'a',
      b: 1,
      c: true
    }

    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)

    orig.c = false
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should shallow clone an array of objects of simple values', function() {
    let orig = [{ a: 'a', b: 1 }, { a: 'b', b: 2 }]
    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)

    orig[0].a = 'c'
    expect(cloned).to.not.deep.equal(orig)
    
    orig[0].a = 'a'
    expect(cloned).to.deep.equal(orig)

    orig.push({ a: 'c', b: 3 })
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should shallow clone an object property of an object', function() {
    let orig = {
      a: {
        a1: 'a1',
        a2: 2
      }
    }

    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)

    orig.a.a1 = 'a2'
    expect(cloned).to.deep.equal(orig)
  })

  it('should deep clone an object property of an object', function() {
    let orig = {
      a: {
        a1: 'a1',
        a2: 2
      }
    }

    let cloned = clone(orig, { a: true })

    expect(cloned).to.deep.equal(orig)

    orig.a.a1 = 'a2'
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should shallow clone an array property of an object which contains only simple values', function() {
    let orig = {
      a: [ 1, 2, 3 ]
    }

    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)

    orig.a.push(4)
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should deep clone an array property of an object which contains only simple values', function() {
    let orig = {
      a: [ 1, 2, 3 ]
    }

    let cloned = clone(orig, { a: true })

    expect(cloned).to.deep.equal(orig)

    orig.a.push(4)
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should shallow clone an array property of an object which contains objects', function() {
    let orig = {
      a: [{ a1: 'a' }, { a2: 'b' }]
    }

    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)

    orig.a[0].a1 = 'z'
    expect(cloned).to.deep.equal(orig)

    orig.a.push({ a1: 'c' })
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should deep clone an array property of an object which contains objects', function() {
    let orig = {
      a: [{ a1: 'a' }, { a2: 'b' }]
    }

    let cloned = clone(orig, { a: true })

    expect(cloned).to.deep.equal(orig)

    orig.a[0].a1 = 'z'
    expect(cloned).to.not.deep.equal(orig)

    orig.a[0].a1 = 'a'
    expect(cloned).to.deep.equal(orig)

    orig.a.push({ a1: 'c' })
    expect(cloned).to.not.deep.equal(orig)
  })

  it('should not get stuck in cirluar object compositions when cloning shallow', function() {
    let orig: any = {}
    orig['a'] = orig

    let cloned = clone(orig)

    expect(cloned).to.deep.equal(orig)
  })

  it('should not get stuck in cirluar object compositions when cloning deep', function() {
    let orig: any = {}
    orig['a'] = orig

    let cloned = clone(orig, { a: true })

    expect(cloned).to.deep.equal(orig)
  })

  it('should use the given instantiator', function() {
    class A {
      a!: string
    }

    let instantiator = {
      'A': () => new A
    }

    let orig = new A
    orig.a = 'a'

    let cloned = clone(orig, {}, instantiator)

    expect(cloned).to.be.instanceOf(A)
  })
})
