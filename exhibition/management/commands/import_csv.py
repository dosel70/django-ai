import pandas as pd
from django.core.management.base import BaseCommand
from exhibition.models import Exhibition
from school.models import School


class Command(BaseCommand):
    help = 'Import data from CSV file'

    def handle(self, *args, **kwargs):
        csv_file_path = 'D:/kdt_0900_lky/복습/workspace/test/ex_contests2.csv'

        try:
            data = pd.read_csv(csv_file_path)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error reading CSV file: {e}'))
            return

        school = School.objects.first()
        if not school:
            self.stdout.write(self.style.ERROR('No School found. Please add a School object first.'))
            return

        for _, row in data.iterrows():
            try:
                Exhibition.objects.create(
                    exhibition_title=row['Title'],
                    exhibition_content=row['Content'],
                    exhibition_url=row['URL'],
                    school=school,
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating Exhibition object: {e}'))

        self.stdout.write(self.style.SUCCESS('Successfully imported data from CSV'))
