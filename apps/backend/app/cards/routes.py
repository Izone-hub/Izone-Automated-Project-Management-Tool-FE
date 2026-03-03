from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.cards import crud
from app.cards.schema import CardCreate, CardUpdate, CardResponse


router = APIRouter(
    prefix="/lists/{list_id}/cards",
    tags=["Cards"]
)


@router.post("/", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    list_id: str,
    data: CardCreate,
    db: Session = Depends(get_db)
):
    return crud.create_card(db, list_id, data)


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
    db: Session = Depends(get_db)
):
    updated = crud.update_card(db, card_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Card not found")
    return updated


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: str,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_card(db, card_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Card not found")

@router.post("/{card_id}/duplicate", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def duplicate_card(
    list_id: str,
    card_id: str,
    db: Session = Depends(get_db)
):
    # Depending on auth, user_id could be extracted from a `current_user` dependency
    new_card = crud.duplicate_card(db, list_id, card_id)
    if not new_card:
        raise HTTPException(status_code=404, detail="Original card not found")
    return new_card
