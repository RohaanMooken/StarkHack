from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import (
    Bounty,
    BountyRewardCategory,
    BountyReward,
    BountyAssetInScope,
    BountyImpactInScope,
    BountyReport,
)
from django.forms.models import model_to_dict
from .serializer import BountySerializer, BountyReportSerializer
from django.http import Http404, FileResponse


# Create your views here.
class BountiesView(APIView):
    def post(self, request):
        data = request.data

        bounty_id = request.query_params.get("id")
        if bounty_id:
            with transaction.atomic():
                bounty = Bounty.objects.get(id=bounty_id)
                report = BountyReport(
                    bounty=bounty,
                    short_description=data["short_description"],
                    pdf=data["pdf"],
                    owner_address=data["owner_address"],
                )
                report.save()
                return Response({"report_uuid": report.id.hex[:8], "bounty_index": bounty.index})
        else:
            with transaction.atomic():
                # Create Bounty object
                bounty = Bounty(
                    index=data["index"],
                    owner_address=data["owner_address"],
                    name=data["name"],
                    vault_tvl=1337,
                    max_bounty=data["max_bounty"],
                    total_paid=1337,
                    ################
                    vault_address="0x1337",
                    program_overview_html=data["overview"],
                    ################
                    rewards_by_threat_level_html=data["rewards"]["text"],
                    ################
                    optional_assets_in_scope_html=data["assets"]["text"],
                    ################
                    optional_impacts_in_scope_html=data["impacts"]["text"],
                    ################
                    out_of_scope_html=data["outOfScope"],
                )
                bounty.save()

                # Create related objects
                for c in data["rewards"]["categories"]:
                    category_name = c["name"]
                    critical = c["critical"]
                    high = c["high"]
                    medium = c["medium"]
                    low = c["low"]

                    category = BountyRewardCategory(
                        bounty=bounty, category=category_name
                    )
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
                        threat_level="Critical",
                        reward_start=critical_a,
                        reward_end=critical_b,
                    )

                    BountyReward.objects.create(
                        bounty_reward_category=category,
                        threat_level="High",
                        reward_start=high_a,
                        reward_end=high_b,
                    )

                    BountyReward.objects.create(
                        bounty_reward_category=category,
                        threat_level="Medium",
                        reward_start=medium_a,
                        reward_end=medium_b,
                    )

                    BountyReward.objects.create(
                        bounty_reward_category=category,
                        threat_level="Low",
                        reward_start=low_a,
                        reward_end=low_b,
                    )

                for asset in data["assets"]["assets"]:
                    BountyAssetInScope.objects.create(
                        bounty=bounty, target=asset["target"], type=asset["type"]
                    )

                for impact in data["impacts"]["impacts"]:
                    BountyImpactInScope.objects.create(
                        bounty=bounty,
                        threat_level=impact["level"],
                        impact=impact["description"],
                    )

            return Response({"message": "Bounty created!"})

    def get(self, request):
        bounty_id = request.query_params.get("id")
        owner_address = request.query_params.get("owner_address")
        if owner_address:
            try:
                data = []
                bounties = Bounty.objects.filter(owner_address=owner_address)
                for bounty in bounties:
                    serializer = BountySerializer(instance=bounty)
                    data.append(serializer.data)
                return Response(data)
            except Bounty.DoesNotExist:
                return Response({"message": "Bounty not found"}, status=404)
        elif bounty_id:
            try:
                bounty = Bounty.objects.get(id=bounty_id)
                serializer = BountySerializer(instance=bounty)
                data = serializer.data
                return Response(data)
            except Bounty.DoesNotExist:
                return Response({"message": "Bounty not found"}, status=404)
        else:
            bounties = Bounty.objects.all()
            data = []
            for bounty in bounties:
                data.append(
                    {
                        "id": bounty.id,
                        "name": bounty.name,
                        "max_bounty": bounty.max_bounty,
                        "last_updated": bounty.last_updated,
                    }
                )
            return Response(data)


class BountyReportView(APIView):
    def get(self, request):
        owner_address = request.query_params.get("owner_address")
        if not owner_address:
            return Response({"error": "No owner_address provided"}, status=400)
        
        data = []

        try:
            reports = BountyReport.objects.filter(owner_address=owner_address)
            for report in reports:
                data.append(
                    {
                        "id": report.id,
                        "bounty_name": report.bounty.name,
                        "short_description": report.short_description,
                    }
                )
        except BountyReport.DoesNotExist:
            raise Http404("No reports found")
        
        return Response(data)


class MediaView(APIView):
    def get(self, request):
        file_url = request.query_params.get("file_url")[1:]
        if not file_url:
            return Response({"error": "No file_url provided"}, status=400)

        try:
            # Assuming file_url is the name of the file in the pdf field
            report = BountyReport.objects.get(pdf=file_url)
        except BountyReport.DoesNotExist:
            raise Http404("File does not exist")

        # Serve the file
        return FileResponse(report.pdf, as_attachment=True, filename=report.pdf.name)