#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { FixtureClass }     from '../tests/fixtures/fixture-class.js'

import { cloneClass }         from './clone-class.js'
import { instanceToClass }    from './instance-to-class.js'

test('instanceToClass smoke testing', async t => {
  const instance = new FixtureClass(1, 2)
  const SameFixtureClass = instanceToClass(instance, FixtureClass)
  t.equal(SameFixtureClass, FixtureClass, 'should get back the same Class for its own instance')
})

test('instanceToClass work with extended class', async t => {
  class ChildFixtureClass extends FixtureClass {}
  const anotherInstance = new ChildFixtureClass(3, 4)
  const SameChildFixtureClass = instanceToClass(anotherInstance, FixtureClass)
  t.equal(SameChildFixtureClass, ChildFixtureClass, 'should get back ChildFixtureClass for instance from its child class')
})

test('instanceToClass work with cloneClass', async t => {
  const ChildFixtureClass = cloneClass(FixtureClass)
  ;(ChildFixtureClass as any).n = 42
  const anotherInstance = new ChildFixtureClass(3, 4)
  const SameChildFixtureClass = instanceToClass(anotherInstance, FixtureClass)
  t.equal(SameChildFixtureClass, ChildFixtureClass, 'should get back ChildFixtureClass for instance from its child class')
  t.equal((SameChildFixtureClass as any).n, 42, 'should get exactly the class with 42')
  t.equal((FixtureClass as any).n, undefined, 'should has not affect the original class')
})
