interface CsvDataRow {
    Date:string;
    Name:string;
    Place:string;
    Profession:string;
  }

interface CsvSheet {
    name:string;
    date:number;
    rows:CsvDataRow[];
}

interface RankDataPoint {
    date: number,
    rank: number,
}
  
interface RankDataSeries {
    id:string;
    data:RankDataPoint[];
}