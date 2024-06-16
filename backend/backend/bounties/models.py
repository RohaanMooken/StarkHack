from django.db import models

# Create your models here.
class Bounty(models.Model):

    # Bounty Information
    name = models.CharField(max_length=100)
    vault_tvl = models.FloatField()
    max_bounty = models.FloatField()
    total_paid = models.FloatField()
    last_updated = models.DateField(auto_now=True)

    # Program Overview
    vault_address = models.CharField(max_length=100, )
    program_overview = models.JSONField()

    # Reward by Threat Level
    rewards_by_threat_level_json = models.JSONField()

    # Assetes in Scope
    optional_assets_in_scope_json = models.JSONField()
    
    # Impacts in Scope
    optional_impacts_in_scope_json = models.JSONField()
    
    # Out of Scope
    out_of_scope_json = models.JSONField()

    
    def __str__(self):
        return self.name


class BountyRewardCategory(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.category


class BountyReward(models.Model):
    bounty_reward_category = models.ForeignKey(BountyRewardCategory, on_delete=models.CASCADE)

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
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    target = models.CharField(max_length=200, )
    type = models.CharField(max_length=200, )

    def __str__(self):
        return self.target + ' - ' + self.type


class BountyImpactInScope(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    
    threat_levels = [
        ('Critical', 'Critical'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    threat_level = models.CharField(max_length=100, choices=threat_levels, default='Low')
    impact = models.TextField()

    def __str__(self):
        return self.target + ' - ' + self.type