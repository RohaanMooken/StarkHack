import uuid
from django.db import models

# Create your models here.
class Bounty(models.Model):

    # Bounty Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    vault_tvl = models.FloatField()
    max_bounty = models.FloatField()
    total_paid = models.FloatField()
    last_updated = models.DateField(auto_now=True)
    owner_address = models.CharField(max_length=100, default='')
    index = models.IntegerField(default=0)
    

    # Program Overview
    vault_address = models.CharField(max_length=100, )
    program_overview_html = models.TextField(default='')

    # Reward by Threat Level
    rewards_by_threat_level_html = models.TextField(default='')

    # Assetes in Scope
    optional_assets_in_scope_html = models.TextField(default='')
    
    # Impacts in Scope
    optional_impacts_in_scope_html = models.TextField(default='')
    
    # Out of Scope
    out_of_scope_html = models.TextField(default='')

    
    def __str__(self):
        return self.name


class BountyRewardCategory(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='rewards')
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.category


class BountyReward(models.Model):
    bounty_reward_category = models.ForeignKey(BountyRewardCategory, on_delete=models.CASCADE, related_name='rewards')

    threat_levels = [
        ('Critical', 'Critical'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    threat_level = models.CharField(max_length=100, choices=threat_levels, default='Low')
    reward_start = models.FloatField(default=0.0)
    reward_end = models.FloatField(default=0.0)

    def __str__(self):
        return self.threat_level


class BountyAssetInScope(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='assets')
    target = models.CharField(max_length=200, )
    type = models.CharField(max_length=200, )

    def __str__(self):
        return self.target + ' - ' + self.type


class BountyImpactInScope(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='impacts')
    
    threat_levels = [
        ('Critical', 'Critical'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    threat_level = models.CharField(max_length=100, choices=threat_levels, default='Low')
    impact = models.TextField()

    def __str__(self):
        return self.impact


def bounty_report_path(instance, filename):
    return "bounty_{0}_{1}_{2}".format(instance.bounty.id, instance.owner_address, filename)


class BountyReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='reports')
    short_description = models.TextField(default='')
    owner_address = models.CharField(max_length=100, default='')
    pdf = models.FileField(upload_to=bounty_report_path)
    index = models.IntegerField(default=0)

    def __str__(self):
        return self.owner_address