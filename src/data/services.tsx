import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Sprout, 
  TreePine, 
  Flower2
} from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  banner: string;
  features: string[];
  gallery: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  services: Service[];
  color: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plant-care',
    name: 'Plant Care',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Professional plant maintenance and care services',
    color: 'from-emerald-500 to-green-600',
    services: [
      {
        id: 'maintenance',
        title: 'Plant Maintenance',
        description: 'Regular care and maintenance for your indoor and outdoor plants',
        banner: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Weekly watering schedule',
          'Fertilization & nutrient management',
          'Pest control & disease prevention',
          'Pruning & trimming services',
          'Soil health monitoring'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'consultation',
        title: 'Plant Consultation',
        description: 'Expert advice on plant selection and placement for your space',
        banner: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Personalized plant recommendations',
          'Light & space assessment',
          'Care instruction guides',
          'Seasonal planning advice',
          'Problem diagnosis & solutions'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600'
        ]
      }
    ]
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: <TreePine className="w-6 h-6" />,
    description: 'Transform your outdoor spaces into beautiful gardens',
    color: 'from-teal-500 to-cyan-600',
    services: [
      {
        id: 'garden-design',
        title: 'Garden Design',
        description: 'Custom garden design tailored to your preferences and space',
        banner: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=1200',
        features: [
          '3D garden visualization',
          'Plant selection & placement',
          'Hardscape design',
          'Irrigation planning',
          'Sustainable landscaping'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'installation',
        title: 'Installation Services',
        description: 'Professional installation of plants, trees, and garden features',
        banner: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Tree & shrub planting',
          'Garden bed preparation',
          'Mulching & edging',
          'Pathway installation',
          'Water feature setup'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600'
        ]
      }
    ]
  },
  {
    id: 'aquarium',
    name: 'Aquarium Services',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Complete aquarium setup and maintenance solutions',
    color: 'from-blue-500 to-indigo-600',
    services: [
      {
        id: 'aquarium-setup',
        title: 'Aquarium Setup',
        description: 'Complete aquarium installation from tank to fish',
        banner: 'https://images.unsplash.com/photo-1520990269108-4f2d8f1a0c6b?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Tank selection & installation',
          'Filtration system setup',
          'Aquascaping design',
          'Fish selection guidance',
          'Water quality testing'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1520990269108-4f2d8f1a0c6b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'aquarium-maintenance',
        title: 'Aquarium Maintenance',
        description: 'Regular maintenance to keep your aquarium healthy and beautiful',
        banner: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Water changes & testing',
          'Filter cleaning',
          'Algae control',
          'Equipment maintenance',
          'Fish health monitoring'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1520990269108-4f2d8f1a0c6b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=600'
        ]
      }
    ]
  },
  {
    id: 'indoor-plants',
    name: 'Indoor Plants',
    icon: <Sprout className="w-6 h-6" />,
    description: 'Indoor plant solutions for homes and offices',
    color: 'from-amber-500 to-orange-600',
    services: [
      {
        id: 'office-plants',
        title: 'Office Plant Solutions',
        description: 'Enhance your workspace with professional plant installations',
        banner: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Workspace assessment',
          'Low-maintenance plant selection',
          'Monthly maintenance visits',
          'Seasonal plant rotation',
          'Air quality improvement'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'home-styling',
        title: 'Home Plant Styling',
        description: 'Create a green oasis in your home with our styling service',
        banner: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Room-by-room plant planning',
          'Decorative pot selection',
          'Plant arrangement design',
          'Care instruction training',
          'Follow-up support'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=600'
        ]
      }
    ]
  },
  {
    id: 'special-events',
    name: 'Special Events',
    icon: <Flower2 className="w-6 h-6" />,
    description: 'Plant and floral arrangements for special occasions',
    color: 'from-pink-500 to-rose-600',
    services: [
      {
        id: 'event-decoration',
        title: 'Event Plant Decoration',
        description: 'Beautiful plant arrangements for weddings, parties, and events',
        banner: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Custom event design',
          'Plant & flower arrangements',
          'Setup & breakdown service',
          'Rental options available',
          'Theme coordination'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600'
        ]
      },
      {
        id: 'gift-plants',
        title: 'Gift Plant Service',
        description: 'Curated plant gifts with personalized care instructions',
        banner: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
        features: [
          'Gift plant selection',
          'Custom packaging',
          'Personalized care cards',
          'Delivery service',
          'Corporate gift options'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?auto=format&fit=crop&q=80&w=600'
        ]
      }
    ]
  }
];
