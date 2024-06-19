from rest_framework import serializers
from .models import (
    Bounty,
    BountyRewardCategory,
    BountyReward,
    BountyAssetInScope,
    BountyImpactInScope,
)


class BountyImpactInScopeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BountyImpactInScope
        fields = ['threat_level', 'impact']


class BountyAssetInScopeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BountyAssetInScope
        fields = ['target', 'type']


class BountyRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BountyReward
        fields = ['threat_level', 'reward_start', 'reward_end']


class BountyRewardCategorySerializer(serializers.ModelSerializer):
    rewards = BountyRewardSerializer(many=True, read_only=True)

    class Meta:
        model = BountyRewardCategory
        fields = ['category', 'rewards']


class BountySerializer(serializers.ModelSerializer):
    rewards = BountyRewardCategorySerializer(many=True, read_only=True)
    assets = BountyAssetInScopeSerializer(many=True, read_only=True)
    impacts = BountyImpactInScopeSerializer(many=True, read_only=True)

    class Meta:
        model = Bounty
        fields = [
            'name',
            'vault_tvl',
            'max_bounty',
            'total_paid',
            'vault_address',
            'program_overview_html',
            'rewards_by_threat_level_html',
            'optional_assets_in_scope_html',
            'optional_impacts_in_scope_html',
            'out_of_scope_html',
            'rewards',
            'assets',
            'impacts',
        ]
