const Professions: { [key: string]: Profession } = {
    Guardian:       { name: 'Guardian',     base: 'Guardian',   type: 'Solider' },
    Dragonhunter:   { name: 'Dragonhunter', base: 'Guardian',   type: 'Solider' },
    Firebrand:      { name: 'Firebrand',    base: 'Guardian',   type: 'Solider' },
    Willbender:     { name: 'Willbender',   base: 'Guardian',   type: 'Solider' },
    Revenant:       { name: 'Revenant',     base: 'Revenant',   type: 'Solider' },
    Herald:         { name: 'Herald',       base: 'Revenant',   type: 'Solider' },
    Renegade:       { name: 'Renegade',     base: 'Revenant',   type: 'Solider' },
    Vindicator:     { name: 'Vindicator',   base: 'Revenant',   type: 'Solider' },
    Warrior:        { name: 'Warrior',      base: 'Warrior',    type: 'Solider' },
    Berserker:      { name: 'Berserker',    base: 'Warrior',    type: 'Solider' },
    Spellbreaker:   { name: 'Spellbreaker', base: 'Warrior',    type: 'Solider' },
    Bladesworn:     { name: 'Bladesworn',   base: 'Warrior',    type: 'Solider' },
    
    Engineer:       { name: 'Engineer',     base: 'Engineer',   type: 'Adventurer' },
    Scrapper:       { name: 'Scrapper',     base: 'Engineer',   type: 'Adventurer' },
    Holosmith:      { name: 'Holosmith',    base: 'Engineer',   type: 'Adventurer' },
    Mechanist:      { name: 'Mechanist',    base: 'Engineer',   type: 'Adventurer' },
    Ranger:         { name: 'Ranger',       base: 'Ranger',     type: 'Adventurer' },
    Druid:          { name: 'Druid',        base: 'Ranger',     type: 'Adventurer' },
    Soulbeast:      { name: 'Soulbeast',    base: 'Ranger',     type: 'Adventurer' },
    Untamed:        { name: 'Untamed',      base: 'Ranger',     type: 'Adventurer' },
    Thief:          { name: 'Thief',        base: 'Thief',      type: 'Adventurer' },
    Daredevil:      { name: 'Daredevil',    base: 'Thief',      type: 'Adventurer' },
    Deadeye:        { name: 'Deadeye',      base: 'Thief',      type: 'Adventurer' },
    Specter:        { name: 'Specter',      base: 'Thief',      type: 'Adventurer' },
    
    Elementalist:   { name: 'Elementalist', base: 'Elementalist',   type: 'Scholar' },
    Tempest:        { name: 'Tempest',      base: 'Elementalist',   type: 'Scholar' },
    Weaver:         { name: 'Weaver',       base: 'Elementalist',   type: 'Scholar' },
    Catalyst:       { name: 'Catalyst',     base: 'Elementalist',   type: 'Scholar' },
    Mesmer:         { name: 'Mesmer',       base: 'Mesmer',         type: 'Scholar' },
    Chronomancer:   { name: 'Chronomancer', base: 'Mesmer',         type: 'Scholar' },
    Mirage:         { name: 'Mirage',       base: 'Mesmer',         type: 'Scholar' },
    Virtuoso:       { name: 'Virtuoso',     base: 'Mesmer',         type: 'Scholar' },
    Necromancer:    { name: 'Necromancer',  base: 'Necromancer',    type: 'Scholar' },
    Reaper:         { name: 'Reaper',       base: 'Necromancer',    type: 'Scholar' },
    Scourge:        { name: 'Scourge',      base: 'Necromancer',    type: 'Scholar' },
    Harbinger:      { name: 'Harbinger',    base: 'Necromancer',    type: 'Scholar' }
};

export function getProfession( name:string ):Profession {
    return Professions[name];
}

type ProfessionCharacter = Profession | Character | undefined;
export function iconPath( pc: ProfessionCharacter ): string {
    if( !pc ) return "icons/Default.png";
    const name = (pc as Profession).base ? pc.name : (pc as Character).profession.name;
    return `icons/${name}.png`;
}

export default Professions;