export default class Contrato {
  id: number;
  title: string;
  object: string;
  desc: string;
  content: string;
  status: string;
  dateStart: Date;
  dateEnd: Date;
  ammount: number;

  constructor(
    id: number,
    title: string,
    object: string,
    desc: string,
    content: string,
    status: string,
    dateStart: Date,
    dateEnd: Date,
    ammount: number
  ) {
    this.id = id;
    this.title = title;
    this.object = object;
    this.desc = desc;
    this.content = content;
    this.status = status;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.ammount = ammount;
  }
}