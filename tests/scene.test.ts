import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sceneReducer, type Scene, type SceneEvent } from '../src/scene.ts'
test('complete narrative with letter and return', () => {
  const events: SceneEvent[] = ['START','FINISH','PLANT','FINISH','LETTER','CLOSE']
  const states = ['growing','bloom','seeding','garden','letter','garden']
  let current: Scene = 'intro'
  events.forEach((event,i)=>{current=sceneReducer(current,event);assert.equal(current,states[i])})
})
test('late callbacks cannot change skipped or replayed scenes', () => {
  assert.equal(sceneReducer(sceneReducer('growing','SKIP'),'FINISH'),'bloom')
  assert.equal(sceneReducer(sceneReducer('seeding','REPLAY'),'FINISH'),'intro')
  assert.equal(sceneReducer('letter','FINISH'),'letter')
})
test('double activation cannot skip a scene', () => {
  assert.equal(sceneReducer(sceneReducer('intro','START'),'START'),'growing')
  assert.equal(sceneReducer(sceneReducer('bloom','PLANT'),'PLANT'),'seeding')
})
test('letter only opens from garden; skip has limited scope', () => {
  for(const scene of ['intro','growing','bloom','seeding'] as Scene[]) assert.equal(sceneReducer(scene,'LETTER'),scene)
  assert.equal(sceneReducer('garden','SKIP'),'garden')
  assert.equal(sceneReducer('letter','SKIP'),'letter')
})
