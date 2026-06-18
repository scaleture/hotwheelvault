import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const envRaw = readFileSync('.env.local', 'utf-8')
const env = Object.fromEntries(
  envRaw.split('\n').filter(Boolean).map(l => {
    const idx = l.indexOf('=')
    return [l.slice(0, idx), l.slice(idx + 1)]
  })
)

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const IMAGES = [
  '/images/products/bone-shaker.svg',
  '/images/products/deora-iii.svg',
  '/images/products/camaro-sth.svg',
  '/images/products/twin-mill.svg',
  '/images/products/f1-mclaren.svg',
  '/images/products/supra.svg',
  '/images/products/ultimate-garage.svg',
  '/images/products/loop-stunt.svg',
]

const products = [
  // ---- FEATURED DROPS ----
  { name: 'Bone Shaker', series: 'Icon Series', scale: '1:64 Die-Cast · Blue & Gold Chrome', price: 449, oldPrice: 599, badge: 'HOT', section: 'featured', sortOrder: 1, image: IMAGES[0] },
  { name: 'Deora III', series: 'HW EV Series', scale: '1:64 Die-Cast · Spectraflame Blue', price: 369, oldPrice: 449, badge: 'NEW', section: 'featured', sortOrder: 2, image: IMAGES[1] },
  { name: "'18 Camaro SS", series: 'Super Treasure Hunt 2024', scale: '1:64 · Real Riders · Spectraflame Gold', price: 1299, badge: 'SUPER TH', section: 'featured', sortOrder: 3, image: IMAGES[2] },
  { name: 'Twin Mill', series: 'Boulevard Premium', scale: '1:64 · Real Riders · Chrome', price: 649, badge: 'LIMITED', section: 'featured', sortOrder: 4, image: IMAGES[3] },
  { name: 'McLaren F1 2024', series: 'Formula 1 Series', scale: '1:64 · Official F1 Livery', price: 549, badge: 'NEW', section: 'featured', sortOrder: 5, image: IMAGES[4] },
  { name: 'Fast & Furious Supra', series: 'Pop Culture', scale: '1:64 · Premium Series', price: 799, badge: 'HOT', section: 'featured', sortOrder: 6, image: IMAGES[5] },
  { name: 'Porsche 911 GT3', series: 'European Premium', scale: '1:64 · Real Riders', price: 599, oldPrice: 749, badge: 'HOT', section: 'featured', sortOrder: 7, image: IMAGES[0] },
  { name: 'Lamborghini Countach', series: 'HW Dream Garage', scale: '1:64 · Spectraflame Red', price: 449, badge: 'NEW', section: 'featured', sortOrder: 8, image: IMAGES[1] },
  { name: 'Ford Mustang GT', series: 'American Muscle', scale: '1:64 · Die-Cast', price: 349, badge: null, section: 'featured', sortOrder: 9, image: IMAGES[2] },
  { name: 'Nissan Skyline R34', series: 'JDM Legends', scale: '1:64 · Premium', price: 899, oldPrice: 1099, badge: 'LIMITED', section: 'featured', sortOrder: 10, image: IMAGES[3] },
  { name: 'Aston Martin Valkyrie', series: 'HW Hypercar', scale: '1:64 · Spectraflame Silver', price: 549, badge: 'HOT', section: 'featured', sortOrder: 11, image: IMAGES[4] },
  { name: 'Dodge Charger SRT', series: 'American Muscle', scale: '1:64 · Real Riders', price: 399, badge: 'NEW', section: 'featured', sortOrder: 12, image: IMAGES[5] },
  { name: 'Ferrari F40', series: 'Icon Series', scale: '1:64 · Premium Red', price: 699, oldPrice: 849, badge: 'HOT', section: 'featured', sortOrder: 13, image: IMAGES[0] },
  { name: 'Batmobile Tumbler', series: 'DC Pop Culture', scale: '1:64 · Premium', price: 1199, badge: 'LIMITED', section: 'featured', sortOrder: 14, image: IMAGES[1] },
  { name: 'Chevrolet Corvette C8', series: 'Sports Car Series', scale: '1:64 · Spectraflame Orange', price: 449, badge: 'NEW', section: 'featured', sortOrder: 15, image: IMAGES[2] },
  { name: 'BMW M3 E30', series: 'Euro Legends', scale: '1:64 · Premium', price: 529, badge: null, section: 'featured', sortOrder: 16, image: IMAGES[3] },

  // ---- TRACK SETS ----
  { name: 'Ultimate Garage', series: 'Hot Wheels City', scale: '5-Level Playset · 2 Cars Included', price: 3499, badge: 'HOT', section: 'track-sets', sortOrder: 1, image: IMAGES[6] },
  { name: 'Loop Stunt Champion', series: 'Track Set', scale: 'Dual-Track Loop · 2 Launchers', price: 1299, oldPrice: 1799, badge: 'NEW', section: 'track-sets', sortOrder: 2, image: IMAGES[7] },
  { name: 'Super 8-Lane Dragstrip', series: 'Racing Circuit', scale: '8-Lane · Electronic Finish Line', price: 4499, oldPrice: 5499, badge: 'HOT', section: 'track-sets', sortOrder: 3, image: IMAGES[6] },
  { name: 'Crash Course Dash', series: 'Track Set', scale: '2-Lane · Crash Zone', price: 2499, badge: 'NEW', section: 'track-sets', sortOrder: 4, image: IMAGES[7] },
  { name: 'Rocket Launch Loop', series: 'Extreme Tracks', scale: 'Motorized Booster · Loop', price: 1999, badge: 'LIMITED', section: 'track-sets', sortOrder: 5, image: IMAGES[6] },
]

console.log(`Seeding ${products.length} products...`)

for (const p of products) {
  const { error } = await supabase.from('products').insert({
    name: p.name,
    series: p.series,
    scale: p.scale,
    price: p.price,
    old_price: p.oldPrice ?? null,
    badge: p.badge ?? null,
    section: p.section,
    sort_order: p.sortOrder,
    image_url: p.image,
  })

  if (error) {
    console.error(`✕ ${p.name}: ${error.message}`)
  } else {
    console.log(`✓ ${p.name}`)
  }
}

console.log('Done!')
