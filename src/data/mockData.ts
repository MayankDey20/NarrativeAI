export interface Story {
  id?: string;           // Database ID
  title: string;
  content: string;
  genre?: string;        // Story genre
  wordCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Choice {
  id: number;
  text: string;
}

export interface Character {
  name: string;
  description: string;
}

export interface Scene {
  name: string;
  description: string;
}

export const mockStory: Story = {
  title: "The Celestial Forge",
  content: `In the depths of the void, where stars are born and galaxies collide, there existed a realm untouched by mortal hands. The Celestial Forge, as it was known to the ancient ones, shimmered with the light of a thousand suns, its surface a tapestry of cosmic fire and stardust.

Aria, a young stargazer with eyes that held the reflection of distant nebulae, stood at the edge of the known universe. Her fingers traced patterns in the stardust that swirled around her, each movement a prayer to the cosmic forces that governed all creation.

The Forge had been silent for millennia, its flames dormant, its power locked away. But tonight, something stirred in the depths of space. A constellation that had not been seen in ten thousand years began to align, its stars forming a key that would unlock the Forge's ancient power.

As Aria watched, the stars began to sing—a melody older than time itself, composed of the vibrations of collapsing suns and the whispers of dark matter. The sound resonated through her very soul, awakening something that had been sleeping within her since birth.

She reached out, her hand trembling, and touched the first star of the constellation. Light erupted from the point of contact, cascading across the cosmos in waves of pure energy. The Celestial Forge roared to life, its flames reaching across galaxies, igniting worlds that had been dark for eons.

But with great power came great danger. The shadows that lurked between the stars began to stir, drawn by the Forge's awakening light. They were ancient, hungry, and they had been waiting for this moment.`
};

export const mockChoices: Choice[] = [
  {
    id: 1,
    text: "Aria channels the Forge's power to create a protective barrier around nearby star systems, but the effort drains her cosmic energy."
  },
  {
    id: 2,
    text: "She attempts to communicate with the ancient shadows, seeking to understand their true nature and perhaps find a way to coexist."
  },
  {
    id: 3,
    text: "Aria decides to seek out the other stargazers who might have knowledge of the Forge's history and how to control its awakening."
  },
  {
    id: 4,
    text: "She focuses on mastering her own newly awakened powers first, retreating to a hidden realm to train before facing the shadows."
  }
];

export const mockCharacters: Character[] = [
  {
    name: "Aria",
    description: "A young stargazer with eyes that reflect distant nebulae. Born with an innate connection to cosmic forces, she can trace patterns in stardust and hear the songs of stars."
  },
  {
    name: "The Ancient Shadows",
    description: "Mysterious entities that lurk between stars, awakened by the Celestial Forge's power. Their true nature and intentions remain unknown."
  },
  {
    name: "The Celestial Forge",
    description: "An ancient cosmic entity, dormant for millennia, capable of creating and destroying worlds. Its power is both a gift and a curse."
  }
];

export const mockScenes: Scene[] = [
  {
    name: "The Void's Edge",
    description: "The boundary between the known universe and the endless void, where stardust swirls in eternal patterns and the laws of physics bend."
  },
  {
    name: "The Celestial Forge",
    description: "A realm of cosmic fire and stardust, shimmering with the light of a thousand suns. The birthplace of stars and galaxies."
  },
  {
    name: "The Hidden Realm",
    description: "A secret dimension where stargazers retreat to train and study the cosmic forces. Time flows differently here, allowing for extended periods of learning."
  }
];

// Additional stories for "Load Story" functionality
export const savedStories: Story[] = [
  mockStory,
  {
    title: "The Whispering Library",
    content: `Deep within the ancient city of Veridia, there stood a library unlike any other. Its shelves stretched into infinity, and its books contained not just words, but entire worlds waiting to be explored.

Elara, a young archivist with a gift for hearing the whispers of forgotten tales, had spent her entire life within these hallowed halls. Each book she touched seemed to pulse with life, its stories eager to be told.

One evening, as the last rays of sunlight filtered through the stained glass windows, Elara discovered a book bound in leather that seemed to have no title. When she opened it, the pages were blank—but as her fingers traced the parchment, words began to appear, written in a language she had never seen but somehow understood.

The book told of a realm where stories were not just told, but lived. A place where every narrative choice created new realities, branching into infinite possibilities. As Elara read, she realized that the library itself was beginning to change around her, its corridors shifting and expanding to match the stories within.`
  },
  {
    title: "The Last Alchemist",
    content: `In the dying days of magic, when the old ways were being forgotten, there lived an alchemist named Thorne who refused to let the ancient arts fade into obscurity. His workshop, hidden in the mountains where the veil between worlds was thin, was filled with bubbling potions and glowing crystals.

Thorne had spent decades searching for the Philosopher's Stone—not for gold, but to restore the balance between the magical and mundane worlds. The stone, he believed, could bridge the gap that had been widening for centuries.

When a young apprentice named Kira arrived at his door, seeking to learn the old ways, Thorne saw in her eyes the same determination that had driven him for so long. Together, they would embark on a quest that would either save magic or witness its final end.

But dark forces were stirring, forces that wanted magic to die so that their own power could rise unchallenged. Thorne and Kira would need more than alchemy to survive what was coming.`
  },
  {
    title: "The Clockwork Heart",
    content: `In the steam-powered city of Gearhaven, where clockwork and magic intertwined, there lived a young inventor named Cora who had been born with a mechanical heart. Her father, a master craftsman, had built it to save her life when she was just a child.

But Cora's clockwork heart was beginning to fail, its gears grinding and its springs losing their tension. She had only months left before it would stop completely, and no replacement could be made—the magic required to animate such a device had been lost.

Desperate, Cora began searching through her father's old journals, hoping to find the secret he had taken to his grave. What she discovered was far more than she bargained for: her father had not just been a craftsman, but a member of a secret society dedicated to preserving the knowledge of mechanical magic.

The society had been destroyed years ago, but its members had hidden their greatest secrets in plain sight—within the very mechanisms that powered Gearhaven itself. Cora's quest to save her own life would lead her to uncover a conspiracy that threatened to destroy everything she held dear.`
  }
];

// Generate new choices based on story context
export const generateChoices = (_storyContent: string): Choice[] => {
  // Simple choice generation based on story context
  const choices: Choice[] = [
    {
      id: 1,
      text: "Continue the narrative by exploring the immediate consequences of the current situation."
    },
    {
      id: 2,
      text: "Introduce a new character or element that could change the direction of the story."
    },
    {
      id: 3,
      text: "Delve deeper into the backstory or reveal hidden information about the current situation."
    },
    {
      id: 4,
      text: "Shift the perspective or introduce a conflict that challenges the protagonist's goals."
    }
  ];
  return choices;
};

