import { Pipe, PipeTransform } from '@angular/core';
import { mapDataInterface } from '../DatasInterface';


@Pipe({
  name: 'titleFilter'
})
export class TitleFilterPipe implements PipeTransform {

  transform(locations: mapDataInterface[], searchTerm: string): mapDataInterface[] {
    if (!locations || !searchTerm) {
      return locations;
    }

    searchTerm = searchTerm.toLowerCase();

    return locations.filter(location => location.title.toLowerCase().includes(searchTerm));
  }
}
