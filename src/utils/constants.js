export const STYLE_TEMPLATES = [
  {
    id: 'medieval',
    name: 'Ortaçağ Şövalyesi',
    prompt: 'Transform this person into a medieval knight in shining armor, standing in front of a majestic castle, epic fantasy style, cinematic lighting, detailed armor with engravings',
    category: 'historical'
  },
  {
    id: 'renaissance',
    name: 'Rönesans Portresi',
    prompt: 'Transform this person into a Renaissance painting style portrait, noble clothing from 15th century, classical architectural background, oil painting technique, rich colors',
    category: 'historical'
  },
  {
    id: 'superhero',
    name: 'Süper Kahraman',
    prompt: 'Transform this person into a superhero with a colorful costume, cape flowing in the wind, standing heroically on a rooftop with city skyline, comic book style, dynamic pose',
    category: 'fantasy'
  },
  {
    id: 'comic',
    name: 'Çizgi Roman',
    prompt: 'Transform this person into comic book character, bold black outlines, vibrant pop art colors, Ben-Day dots pattern, speech bubble in background, Roy Lichtenstein style',
    category: 'art'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'Transform this person into cyberpunk character, neon-lit futuristic clothing, cybernetic enhancements, dark urban background with holographic advertisements, Blade Runner aesthetic',
    category: 'sci-fi'
  },
  {
    id: 'steampunk',
    name: 'Steampunk',
    prompt: 'Transform this person into steampunk character, brass goggles, leather clothing with gears, Victorian-era industrial background, copper and bronze tones, mechanical elements',
    category: 'fantasy'
  },
  {
    id: 'anime',
    name: 'Anime Karakteri',
    prompt: 'Transform this person into an anime character, large expressive eyes, colorful hair, detailed anime art style, vibrant background, Studio Ghibli inspired',
    category: 'art'
  },
  {
    id: 'vintage',
    name: 'Vintage Poster',
    prompt: 'Transform this person into a vintage travel poster style, retro color palette, art deco elements, 1950s advertising aesthetic, bold typography background',
    category: 'art'
  },
  {
    id: 'watercolor',
    name: 'Sulu Boya',
    prompt: 'Transform this person into a watercolor painting, soft flowing colors, artistic brushstrokes, dreamy ethereal background, impressionist style',
    category: 'art'
  },
  {
    id: 'noir',
    name: 'Film Noir',
    prompt: 'Transform this person into a film noir character, black and white with dramatic shadows, 1940s detective style, cigarette smoke, urban night scene',
    category: 'historical'
  },
  {
    id: 'space',
    name: 'Uzay Kaşifi',
    prompt: 'Transform this person into a space explorer, futuristic space suit, alien planet background, sci-fi adventure style, cosmic lighting effects',
    category: 'sci-fi'
  },
  {
    id: 'pirate',
    name: 'Korsan',
    prompt: 'Transform this person into a pirate captain, weathered clothing, tricorn hat, ship deck background, treasure map elements, adventure style',
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
