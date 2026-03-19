export class usersInterfaz {
  _id?: string;
  names!: string;
  last_names!: string;
  ci!: string;
  phone!: string;
  password!: string;
  email!: string;
  sex!: string;
  image: string | null = null;
  idrol!: string;
  namerol!: string;
  address: dataAddress[] = [];
  obs!: string;
  apartment!: string;
  residence!: string;
  property!: string;
  time!: string;

  constructor() {}
}
export class dataAddress {
  country!: string;
  city!: string;
  province!: string;
  district!: string;
  road!: string;
  neighbourhood!: string;
  number!: string;
  edifice!: string;
  obs!: string;
  lat!: number;
  lon!: number;
  constructor() {}
}
