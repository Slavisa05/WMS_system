from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('warehouse', '0003_alter_slot_kapacitet'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skladiste',
            name='naziv',
            field=models.CharField(db_index=True, max_length=50, unique=True),
        ),
    ]