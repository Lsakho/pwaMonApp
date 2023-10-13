import { Pipe, PipeTransform } from '@angular/core';
import { mapDataInterface } from '../DatasInterface';

@Pipe({
  name: 'activityFilter'
})
export class ActivityFilterPipe implements PipeTransform {
  transform(locations: mapDataInterface[], selectedActivity: string): mapDataInterface[] {
    if (selectedActivity === 'Toutes') {
      return locations;
    }
  
    return locations.filter(location => location.equipement && location.equipement.includes(selectedActivity));
  }
  
}
