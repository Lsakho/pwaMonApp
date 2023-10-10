export interface mapInterface{
    title: string;
    data: mapDataInterface[];
}
export interface mapDataInterface{
    title: string;
    id: number;
    adresse: string;
    latitude:  string;
    longitude: string;
    imageUrl:[{
        "img": "src= 'https://www.geneve.ch/sites/default/files/fileadmin/public/images/Lieux/Loisirs_et_jeux/Places_de_jeux_autres/place-jeux-plaine-plainpalais-structure-bois-ville-geneve.jpg' "
    }]

}