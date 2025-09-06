export const STYLE_TEMPLATES = [
  {
    id: 'medieval',
    name: 'medieval',
    prompt: 'Transform this person into a medieval knight in shining armor, standing in front of a majestic castle, epic fantasy style, cinematic lighting, detailed armor with engravings',
    category: 'historical'
  },
  {
    id: 'renaissance',
    name: 'renaissance',
    prompt: 'Transform this person into a Renaissance painting style portrait, noble clothing from 15th century, classical architectural background, oil painting technique, rich colors',
    category: 'historical'
  },
  {
    id: 'superhero',
    name: 'superhero',
    prompt: 'Transform this person into a superhero with a colorful costume, cape flowing in the wind, standing heroically on a rooftop with city skyline, comic book style, dynamic pose',
    category: 'fantasy'
  },
  {
    id: 'comic',
    name: 'comic',
    prompt: 'Transform this person into comic book character, bold black outlines, vibrant pop art colors, Ben-Day dots pattern, speech bubble in background, Roy Lichtenstein style',
    category: 'art'
  },
  {
    id: 'cyberpunk',
    name: 'cyberpunk',
    prompt: 'Transform this person into cyberpunk character, neon-lit futuristic clothing, cybernetic enhancements, dark urban background with holographic advertisements, Blade Runner aesthetic',
    category: 'sci-fi'
  },
  {
    id: 'steampunk',
    name: 'steampunk',
    prompt: 'Transform this person into steampunk character, brass goggles, leather clothing with gears, Victorian-era industrial background, copper and bronze tones, mechanical elements',
    category: 'fantasy'
  },
  {
    id: 'anime',
    name: 'anime',
    prompt: 'Transform this person into an anime character, large expressive eyes, colorful hair, detailed anime art style, vibrant background, Studio Ghibli inspired',
    category: 'art'
  },
  {
    id: 'vintage',
    name: 'vintage',
    prompt: 'Transform this person into a vintage travel poster style, retro color palette, art deco elements, 1950s advertising aesthetic, bold typography background',
    category: 'art'
  },
  {
    id: 'watercolor',
    name: 'watercolor',
    prompt: 'Transform this person into a watercolor painting, soft flowing colors, artistic brushstrokes, dreamy ethereal background, impressionist style',
    category: 'art'
  },
  {
    id: 'noir',
    name: 'noir',
    prompt: 'Transform this person into a film noir character, black and white with dramatic shadows, 1940s detective style, cigarette smoke, urban night scene',
    category: 'historical'
  },
  {
    id: 'space',
    name: 'space',
    prompt: 'Transform this person into a space explorer, futuristic space suit, alien planet background, sci-fi adventure style, cosmic lighting effects',
    category: 'sci-fi'
  },
  {
    id: 'pirate',
    name: 'pirate',
    prompt: 'Transform this person into a pirate captain, weathered clothing, tricorn hat, ship deck background, treasure map elements, adventure style',
    category: 'fantasy'
  },
  {
    id: 'lotr',
    name: 'lotr',
    prompt: 'Transform this person into a Lord of the Rings character, medieval fantasy clothing, elven or hobbit style, Middle-earth landscape background, epic fantasy atmosphere, detailed costume with intricate details',
    category: 'fantasy'
  },
  {
    id: 'fantastic4',
    name: 'fantastic4',
    prompt: 'Transform this person into a Fantastic Four character, 1960s retro-futuristic superhero costume, cosmic powers, space-age technology, vibrant colors, Marvel comic book style, heroic pose',
    category: 'fantasy'
  }
];

export const IMAGE_CONSTRAINTS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxDimensions: { width: 2048, height: 2048 }
};

export const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models'
};
