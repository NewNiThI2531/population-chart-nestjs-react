import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
// @ts-ignore
import * as csv from 'csv-parser';
import { continentColorMap, countryContinentMap } from './continent-color-map';
import { countryFlagMap } from './country-flag-map';

// Get Data  ข้อมูลทั้งหมด
@Controller('api/alldata')
export class AllPopulationController {
  @Get()
  getAllData(): Promise<any[]> {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('../population-and-demography.csv')
        .pipe(csv() as any)
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}

// Get Data แค่ ชื่อ ประเทศ จำนวนประชากร และปี | Map ข้อมูลที่ไม่ได้ต้องการออก
@Controller('api/population')
export class PopulationController {
  @Get()
  getPopulation(): Promise<any[]> {
    const results: any[] = [];

    const excludeCountries = [
      'Less developed regions',
      'Less developed regions, excluding least developed countries',
      'Less developed regions, excluding least developed countries',
      'Africa (UN)','High-income countries','High-income countries',
      'Asia (UN)','Europe (UN)','Less developed regions, excluding China','Lower-middle-income countries',
      'Upper-middle-income countries','Land-locked developing countries (LLDC)','Low-income countries','Europe (UN)',
      'Latin America and the Caribbean (UN)','Latin America and the Caribbean (UN)','More developed regions',
      'Least developed countries','Northern America (UN)','Small island developing states (SIDS)'
    ];

    return new Promise((resolve, reject) => {
      fs.createReadStream('../population-and-demography.csv')
        .pipe(csv() as any)
        .on('data', (data: any) => {
          const country = data['Country name'];
          const year = data['Year'];
          const population = data['Population'];

          // ตรวจสอบว่ามีข้อมูลครบ และไม่อยู่ในกลุ่มที่ต้องการกรอง
          if (country && year && population && !excludeCountries.includes(country)) {
            results.push({
              'Country name': country,
              'Year': year,
              'Population': population
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }
}

// Get Map ประเทศแบ่งตามทวีป จำกัดสีของแต่ละทวีป
@Controller('api/continentcolor')
export class ContinentColorController {
  @Get()
  getContinentInfo() {
    const result = Object.entries(countryContinentMap).map(([country, continent]) => ({
      country,
      continent,
      color: continentColorMap[continent] || '#cccccc'
    }));
    return result;
  }
}

// Get Map flag ตามแต่ละประเทศ
@Controller('api/flags')
export class FlagController {
  @Get()
  getFlagData() {
    return Object.entries(countryFlagMap).map(([country, filename]) => ({
      country,
      flagUrl:  `http://localhost:3000/flags/${filename}`,
    }));
  }
}