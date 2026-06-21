export type MenuCategory = 'Espresso' | 'Pour Over' | 'Cold Brew' | 'Signature' | 'Pastries';

export const CATEGORIES: MenuCategory[] = ['Espresso', 'Pour Over', 'Cold Brew', 'Signature', 'Pastries'];

export interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  image: string;
  featured?: boolean;
  in_stock?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const MENU_ITEMS: CoffeeItem[] = [
  {
    id: 'm1',
    name: 'House Espresso',
    description: 'Our signature single-origin espresso blend — rich crema, notes of dark chocolate and toasted hazelnut, pulled to perfection.',
    price: '$4.50',
    category: 'Espresso',
    image: 'https://images.pexels.com/photos/12975714/pexels-photo-12975714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    featured: true
  },
  {
    id: 'm2',
    name: 'Smoked Caramel Latte',
    description: 'Velvety steamed milk meets double espresso and house-made smoked caramel syrup, finished with a whisper of sea salt.',
    price: '$5.75',
    category: 'Signature',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80',
    featured: true
  },
  {
    id: 'm3',
    name: 'Ethiopian Pour Over',
    description: 'Single-origin Yirgacheffe beans — delicate floral aroma with bright citrus notes and a silky, tea-like body.',
    price: '$6.00',
    category: 'Pour Over',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    featured: true
  },
  {
    id: 'm4',
    name: 'Nitro Cold Brew',
    description: 'Slow-steeped for 20 hours, infused with nitrogen for a cascading creamy texture — bold, smooth, naturally sweet.',
    price: '$5.50',
    category: 'Cold Brew',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    featured: true
  },
  {
    id: 'm5',
    name: 'Lavender Honey Cortado',
    description: 'A delicate balance of floral lavender, wild honey, and a short double shot cut with warm silky milk.',
    price: '$5.25',
    category: 'Signature',
    image: 'https://images.pexels.com/photos/30556589/pexels-photo-30556589.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800'
  },
  {
    id: 'm6',
    name: 'Classic Cappuccino',
    description: 'Perfectly frothed milk crowning a double espresso — simple, timeless, and utterly satisfying.',
    price: '$4.75',
    category: 'Espresso',
    image: 'https://images.pexels.com/photos/20777769/pexels-photo-20777769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800'
  },
  {
    id: 'm7',
    name: 'Japanese Iced Coffee',
    description: 'Hot-brewed single-origin coffee dripped directly over ice — capturing vibrant aromatics that cold brew cannot.',
    price: '$5.00',
    category: 'Pour Over',
    image: 'https://images.pexels.com/photos/31621814/pexels-photo-31621814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800'
  },
  {
    id: 'm8',
    name: 'Brew & Bean Mocha',
    description: 'Rich single-origin espresso meets velvety Belgian chocolate sauce, topped with house-made whipped cream.',
    price: '$5.50',
    category: 'Signature',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80'
  },
  {
    id: 'p1',
    name: 'Butter Croissant',
    description: 'French-style laminated pastry baked fresh throughout the day — golden, flaky, indulgent.',
    price: '$3.75',
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80'
  },
  {
    id: 'p2',
    name: 'Honey Almond Scone',
    description: 'Buttery scone studded with toasted almonds and finished with a honey glaze — pairs perfectly with any brew.',
    price: '$4.00',
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80'
  }
];

export const FEATURED_ITEMS = MENU_ITEMS.filter(item => item.featured);

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Elena Rossi',
    role: 'Coffee Connoisseur',
    quote: 'Finally — a coffee shop that respects the bean as much as I do. The Ethiopian pour-over is a masterpiece of clarity and nuance.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop&crop=faces'
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Regular & Architect',
    quote: 'The warm amber lighting, the smell of fresh grounds, the perfect latte art — this is my sanctuary. Best cold brew in the city, hands down.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=faces'
  },
  {
    id: 't3',
    name: 'Sarah Mitchell',
    role: 'Pastry Chef',
    quote: 'Their butter croissant rivals any Parisian boulangerie, and the smoked caramel latte is pure genius. A warm hug in a mug.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop&crop=faces'
  }
];

export const GALLERY_IMAGES = [
  {
    id: 'g1',
    title: 'Morning Pour Over',
    category: 'Craft',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 'g2',
    title: 'Cozy Reading Nook',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    span: 'md:col-span-1'
  },
  {
    id: 'g3',
    title: 'Perfect Latte Art',
    category: 'Craft',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    span: 'md:col-span-1'
  },
  {
    id: 'g4',
    title: 'Barista at Work',
    category: 'Behind the Scenes',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80',
    span: 'md:col-span-2'
  },
  {
    id: 'g5',
    title: 'Freshly Roasted Beans',
    category: 'Behind the Scenes',
    image: 'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=800&q=80',
    span: 'md:col-span-1'
  },
  {
    id: 'g6',
    title: 'Evening Ambiance',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    span: 'md:col-span-1'
  }
];
