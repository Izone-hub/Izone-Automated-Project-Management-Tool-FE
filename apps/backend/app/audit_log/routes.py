
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.audit_log.schema import  AuditLogRead
from app.audit_log.crud import get_audit_logs_by_user as crud_read_audit_log

router = APIRouter(tags=["Audit Logs"], prefix="/audit-logs")


@router.get("/", response_model=list[AuditLogRead])
def read_audit_log( user_id: str, db: Session = Depends(get_db)):
    
    return crud_read_audit_log(db, user_id) 