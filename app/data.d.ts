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
    player:string;
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