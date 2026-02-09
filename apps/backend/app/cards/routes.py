from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.cards import crud
from app.cards.schema import CardCreate, CardUpdate, CardResponse
from app.auth.security import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/lists/{list_id}/cards",
    tags=["Cards"]
)


@router.post("/", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    list_id: str,
    data: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_card(db, list_id, data, str(current_user.id))


@router.get("/", response_model=list[CardResponse])
def get_cards(
    list_id: str,
    db: Session = Depends(get_db)
):
    return crud.get_cards_by_list(db, list_id)


@router.put("/{card_id}", response_model=CardResponse)
def update_card(
    card_id: str,
    data: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = crud.update_card(db, card_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Card not found")
    return updated


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = crud.delete_card(db, card_id, str(current_user.id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Card not found")
