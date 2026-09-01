/* Gym AI service worker — offline total (v5) */
const CACHE='gymai-v7';
const ASSETS=["./","./index.html","./assets/barbell-bench-press.gif","./assets/dumbbell-bench-press.gif","./assets/dumbbell-incline-bench-press.gif","./assets/dumbbell-fly.gif","./assets/incline-push-up.gif","./assets/lever-leg-extension.gif","./assets/barbell-single-leg-split-squat.gif","./assets/smith-chair-squat.gif","./assets/dead-bug.gif","./assets/hanging-leg-raise.gif","./assets/cable-kneeling-crunch.gif","./assets/captains-chair-straight-leg-raise.gif","./assets/low-glute-bridge-on-floor.gif","./assets/dumbbell-lateral-raise.gif","./assets/cable-lateral-raise.gif","./assets/dumbbell-arnold-press.gif","./assets/barbell-seated-overhead-press.gif","./assets/cable-pulldown.gif","./assets/pull-up.gif","./assets/chin-up.gif","./assets/cable-lying-extension-pullover-with-rope-attachment.gif","./assets/cable-pushdown.gif","./assets/bench-dip-on-floor.gif","./assets/barbell-close-grip-bench-press.gif","./assets/dumbbell-standing-triceps-extension.gif","./assets/dumbbell-lying-triceps-extension.gif","./assets/assisted-triceps-dip-kneeling.gif","./assets/barbell-good-morning.gif","./assets/lever-lying-leg-curl.gif","./assets/lever-seated-leg-curl.gif","./assets/cable-cross-over-variation.gif","./assets/dumbbell-goblet-squat.gif","./assets/dumbbell-biceps-curl.gif","./assets/dumbbell-hammer-curl.gif","./assets/barbell-curl.gif","./assets/cable-curl.gif","./assets/band-alternating-biceps-curl.gif","./assets/lever-standing-calf-raise.gif","./assets/sled-calf-press-on-leg-press.gif","./assets/dumbbell-standing-calf-raise.gif","./assets/bodyweight-standing-calf-raise.gif","./assets/star-jump-male.gif","./assets/Leverage_Chest_Press.jpg","./assets/Butterfly.jpg","./assets/Leverage_Incline_Chest_Press.jpg","./assets/Pushups.jpg","./assets/Push-Ups_-_Close_Triceps_Position.jpg","./assets/Seated_Cable_Rows.jpg","./assets/Leverage_High_Row.jpg","./assets/Bent_Over_Barbell_Row.jpg","./assets/One-Arm_Dumbbell_Row.jpg","./assets/Barbell_Deadlift.jpg","./assets/Dumbbell_Shrug.jpg","./assets/Inverted_Row.jpg","./assets/Superman.jpg","./assets/Smith_Machine_Overhead_Shoulder_Press.jpg","./assets/Reverse_Machine_Flyes.jpg","./assets/Machine_Bicep_Curl.jpg","./assets/Cable_Rope_Overhead_Triceps_Extension.jpg","./assets/Leg_Press.jpg","./assets/Barbell_Hack_Squat.jpg","./assets/Barbell_Squat.jpg","./assets/Dumbbell_Lunges.jpg","./assets/Bodyweight_Squat.jpg","./assets/Freehand_Jump_Squat.jpg","./assets/Barbell_Walking_Lunge.jpg","./assets/Romanian_Deadlift.jpg","./assets/Single_Leg_Glute_Bridge.jpg","./assets/Barbell_Hip_Thrust.jpg","./assets/Glute_Kickback.jpg","./assets/Thigh_Abductor.jpg","./assets/Sumo_Deadlift.jpg","./assets/Standing_Cable_Wood_Chop.jpg","./assets/Russian_Twist.jpg","./assets/Plank.jpg","./assets/Toe_Touchers.jpg","./assets/Air_Bike.jpg"];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(ASSETS.map(u=>c.add(u)))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  e.respondWith(
    caches.match(req).then(hit=>{
      if(hit)return hit;
      return fetch(req).then(res=>{
        try{ const u=new URL(req.url);
          if(u.pathname.includes('/assets/')||/jsdelivr|githubusercontent/.test(u.host)){
            const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp));
          }
        }catch(_){}
        return res;
      }).catch(()=>hit);
    })
  );
});
