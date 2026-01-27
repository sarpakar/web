#!/bin/bash

# Campus Meals Production Deployment Script
# Prerequisites: gcloud CLI, Firebase CLI installed and authenticated

set -e

echo "🚀 Campus Meals Production Deployment"
echo "======================================"

PROJECT_ID="campusmealsv2-bd20b"
REGION="us-central1"
SERVICE_NAME="campusmeals"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo -e "\n${YELLOW}Checking prerequisites...${NC}"

    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install${NC}"
        exit 1
    fi

    if ! command -v firebase &> /dev/null; then
        echo -e "${RED}❌ Firebase CLI not found. Run: npm install -g firebase-tools${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Set GCP project
set_project() {
    echo -e "\n${YELLOW}Setting GCP project...${NC}"
    gcloud config set project $PROJECT_ID
    echo -e "${GREEN}✅ Project set to $PROJECT_ID${NC}"
}

# Enable required APIs
enable_apis() {
    echo -e "\n${YELLOW}Enabling required GCP APIs...${NC}"

    gcloud services enable \
        cloudbuild.googleapis.com \
        run.googleapis.com \
        containerregistry.googleapis.com \
        secretmanager.googleapis.com \
        artifactregistry.googleapis.com \
        --quiet

    echo -e "${GREEN}✅ APIs enabled${NC}"
}

# Deploy Firebase rules
deploy_firebase_rules() {
    echo -e "\n${YELLOW}Deploying Firebase Security Rules...${NC}"

    firebase deploy --only firestore:rules --project $PROJECT_ID
    firebase deploy --only storage --project $PROJECT_ID

    echo -e "${GREEN}✅ Firebase rules deployed${NC}"
}

# Deploy Firestore indexes
deploy_indexes() {
    echo -e "\n${YELLOW}Deploying Firestore Indexes...${NC}"

    firebase deploy --only firestore:indexes --project $PROJECT_ID

    echo -e "${GREEN}✅ Firestore indexes deployed${NC}"
}

# Build and deploy to Cloud Run
deploy_cloud_run() {
    echo -e "\n${YELLOW}Building and deploying to Cloud Run...${NC}"

    # Build the container
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

    # Deploy to Cloud Run
    gcloud run deploy $SERVICE_NAME \
        --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 100 \
        --concurrency 80 \
        --timeout 300 \
        --set-env-vars "NODE_ENV=production"

    echo -e "${GREEN}✅ Deployed to Cloud Run${NC}"
}

# Get service URL
get_service_url() {
    echo -e "\n${YELLOW}Getting service URL...${NC}"

    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

    echo -e "${GREEN}✅ Service URL: $SERVICE_URL${NC}"
}

# Map custom domain
map_custom_domain() {
    echo -e "\n${YELLOW}Custom Domain Setup Instructions:${NC}"
    echo "1. Go to: https://console.cloud.google.com/run/domains"
    echo "2. Click 'Add Mapping'"
    echo "3. Select service: $SERVICE_NAME"
    echo "4. Enter your domain: campusmeals.com"
    echo "5. Add the DNS records shown to your domain registrar"
}

# Main deployment
main() {
    echo ""
    echo "Select deployment option:"
    echo "1) Full deployment (Firebase + Cloud Run)"
    echo "2) Firebase rules only"
    echo "3) Cloud Run only"
    echo "4) Setup custom domain"
    echo ""
    read -p "Enter choice [1-4]: " choice

    case $choice in
        1)
            check_prerequisites
            set_project
            enable_apis
            deploy_firebase_rules
            deploy_indexes
            deploy_cloud_run
            get_service_url
            ;;
        2)
            check_prerequisites
            set_project
            deploy_firebase_rules
            deploy_indexes
            ;;
        3)
            check_prerequisites
            set_project
            enable_apis
            deploy_cloud_run
            get_service_url
            ;;
        4)
            map_custom_domain
            ;;
        *)
            echo "Invalid option"
            exit 1
            ;;
    esac

    echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
}

main
