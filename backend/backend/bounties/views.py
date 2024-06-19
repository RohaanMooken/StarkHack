from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import Bounty, BountyRewardCategory, BountyReward, BountyAssetInScope, BountyImpactInScope

# Create your views here.
class BountiesView(APIView):
    def post(self, request):
        data = request.data

        print(data)

        m_bounty = 0
        for category in data['rewards']['categories']:
            if max(category['critical']) > m_bounty:
                m_bounty = max(category['critical'])

        with transaction.atomic():
            # Create Bounty object
            bounty = Bounty(
                name=data["name"],
                vault_tvl=1337,
                max_bounty=m_bounty,
                total_paid=1337,
                ################
                vault_address="0x1337",
                program_overview_html=data['overview'],
                ################
                rewards_by_threat_level_html=data['rewards']['text'],
                ################
                optional_assets_in_scope_html=data['assets']['text'],
                ################
                optional_impacts_in_scope_html=data['impacts']['text'],
                ################
                out_of_scope_html=data['outOfScope']

            )
            bounty.save()

            # Create related objects 
            for c in data['rewards']['categories']:
                category_name = c['name']
                critical = c['critical']
                high = c['high']
                medium = c['medium']
                low = c['low']

                category = BountyRewardCategory(bounty=bounty, category=category_name)
                category.save()

                critical_a = critical[0]
                critical_b = critical_a
                if len(critical) > 1:
                    critical_b = critical[1]
                
                high_a = high[0]
                high_b = high_a
                if len(high) > 1:
                    high_b = high[1]

                medium_a = medium[0]
                medium_b = medium_a
                if len(medium) > 1:
                    medium_b = medium[1]

                low_a = low[0]
                low_b = low_a
                if len(low) > 1:
                    low_b = low[1]
                
                BountyReward.objects.create(
                    bounty_reward_category=category,
                    threat_level='Critical',
                    reward_start=critical_a,
                    reward_end=critical_b
                )

                BountyReward.objects.create(
                    bounty_reward_category=category,
                    threat_level='High',
                    reward_start=high_a,
                    reward_end=high_b
                )

                BountyReward.objects.create(
                    bounty_reward_category=category,
                    threat_level='Medium',
                    reward_start=medium_a,
                    reward_end=medium_b
                )

                BountyReward.objects.create(
                    bounty_reward_category=category,
                    threat_level='Low',
                    reward_start=low_a,
                    reward_end=low_b
                )

            for asset in data['assets']['assets']:
                BountyAssetInScope.objects.create(
                    bounty=bounty,
                    target=asset['target'],
                    type=asset['type']
                )

            for impact in data['impacts']['impacts']:
                BountyImpactInScope.objects.create(
                    bounty=bounty,
                    threat_level=impact['level'],
                    impact=impact['description']
                )

        return Response({"message": "Bounty created!"})

    def get(self, request):
        bounties = Bounty.objects.all()
        data = []
        for bounty in bounties:
            data.append({
                'id': bounty.id,
                'name': bounty.name,
                'max_bounty': bounty.max_bounty,
                'last_updated': bounty.last_updated
            })
        return Response(data)