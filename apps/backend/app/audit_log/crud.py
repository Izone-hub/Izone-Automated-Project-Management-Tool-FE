from sqlalchemy.orm import Session
from uuid import UUID
from app.models.audit_log import AuditLog as AuditLogModel
from app.audit_log.schema import AuditLogRead, AuditLog 



def create_audit_log(db: Session, data: AuditLogRead) -> AuditLog:
    log = AuditLogModel(
        action=data.action,
        user_id=data.user_id
    )
    db.add(log)
    db.commit()
    db.refresh(log)


    return AuditLog(
        id=str(log.id),
        action=log.action,
        user_id=str(log.user_id)
    )



def get_all_audit_logs(db: Session) -> list[AuditLog]:
    logs = db.query(AuditLogModel).all()
    return [
        AuditLog(
            id=str(log.id),
            action=log.action,
            user_id=str(log.user_id)
        )
        for log in logs
    ]



def get_audit_logs_by_user(db: Session, user_id: UUID) -> list[AuditLog]:
    logs = db.query(AuditLogModel).filter(AuditLogModel.user_id == user_id).all()
    return [
        AuditLog(
            id=str(log.id),
            action=log.action,
            user_id=str(log.user_id)
        )
        for log in logs
    ]