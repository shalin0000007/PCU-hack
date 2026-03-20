import asyncio
from app.api.routes import start_analysis

async def run_test():
    try:
        await start_analysis(
            company_name="Test",
            industry="IT",
            loan_amount=50000.0,
            purpose="Test loan",
            external_company=None,
            gst_file=None,
            bank_file=None
        )
        print("SUCCESS")
    except Exception as e:
        import traceback
        print("ERRORED OUT HERE:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run_test())
