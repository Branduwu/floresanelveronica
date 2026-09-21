export type Scene = 'intro' | 'growing' | 'bloom' | 'seeding' | 'garden' | 'letter'
export type SceneEvent = 'START' | 'FINISH' | 'PLANT' | 'SKIP' | 'LETTER' | 'CLOSE' | 'REPLAY'
export function sceneReducer(scene: Scene, event: SceneEvent): Scene {
  if (event === 'REPLAY') return 'intro'
  if (event === 'SKIP' && (scene === 'intro' || scene === 'growing')) return 'bloom'
  if (scene === 'intro' && event === 'START') return 'growing'
  if (scene === 'growing' && event === 'FINISH') return 'bloom'
  if (scene === 'bloom' && event === 'PLANT') return 'seeding'
  if (scene === 'seeding' && event === 'FINISH') return 'garden'
  if (scene === 'garden' && event === 'LETTER') return 'letter'
  if (scene === 'letter' && event === 'CLOSE') return 'garden'
  return scene
}
