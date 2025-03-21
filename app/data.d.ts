interface Player {
  id: string;
  characters:Character[];
}

interface Profession{
  name:string;
  base:string;
  type:string;
}

interface Character {
  name: string;
  profession: Profession;
  id: string;
}

interface CsvDataRow {
    Date:string;
    Name:string;
    Profession:string;
    [key:string]: string|number|boolean;
  }

interface CsvSheet {
    name:string;
    date:number;
    data:any[];
}

interface RankSummary {
    name:string;
    player:Player;
    character:Character;
    ranks:number[];
    count:number;
  }

interface RankDataPoint {
    date: number,
    rank: number,
}
  
interface RankDataSeries {
    id:string;
    data:RankDataPoint[];
}