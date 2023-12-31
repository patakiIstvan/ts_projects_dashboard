import React, { useEffect, useRef, useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { dummy_roles } from '../../../utils/dummydata';
import CloseButton from 'react-bootstrap/CloseButton';
import './memberinput.scss';


interface MemberInputProps {
  handleMemberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData?: Record<string, any>
  page?: number;
  error?: string;
  deleteItem?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

type memberType = { name: string, role: string[] }
type memberListType = { [key: string]: memberType }


const MemberInput: React.FC<MemberInputProps> = (props) => {

  const [inputId, setInputId] = useState(props?.formData?.members?.value && Object.keys(props?.formData?.members?.value).length !== 0 ? Math.max(...Object.keys(props?.formData?.members?.value).map(Number)) + 1 : 0);
  const [role, setRole] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null)

  const newMember = function (inputRef: React.RefObject<HTMLInputElement>) {
    if (inputRef.current && inputRef.current.value.length > 0) {
      if (role.length > 0) {
        setInputId(prevId => prevId + 1);
      }
    }
  }

  const handleRole = function (e: React.MouseEvent<HTMLElement> | null, clearRoles = false): void {
    if (!clearRoles && e) {
      const value: string | null = e.currentTarget.getAttribute('value');
      if (value) {
        setRole([value]);
      }
    } else {
      setRole([]);
    }
  }

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [role])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.focus();
      handleRole(null)
    }
  }, [inputId])


  return (
    <>
      <div className="linkInput-container">
        <InputGroup className="main-linkInput">

          <Form.Control
            type="text"
            name="members"
            role={role.length > 0 ? role[0] : ""}
            data-inputid={inputId}
            placeholder="Assignee"
            onChange={props.handleMemberChange}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => props.handleMemberChange && props.handleMemberChange(e)}
            ref={inputRef}
            data-page={props.page ?? 0}
          />
          <DropdownButton
            variant="outline-secondary"
            title="Role"
            id="input-group-dropdown-2"
            align="end"
          >
            {dummy_roles.map(role => (
              <Dropdown.Item key={role} onClick={handleRole} value={role} href="#">{role}</Dropdown.Item>
            ))}
          </DropdownButton>
          <Button onClick={() => { newMember(inputRef) }} variant="outline-secondary">Add member</Button>

        </InputGroup>
        {props.formData?.members?.value && Object.entries(props.formData?.members?.value as memberListType).map(([memberId, member], idx) => (
          (<React.Fragment key={idx}>
            <div className="input-list-container">
              <Form.Control
                type="text"
                disabled
                name="members"
                data-inputid={memberId}
                value={`${member?.name ? member.name : ''}${member?.role?.length > 0 ? " - " + member.role[0] : ""}`}
                data-page={props.page ?? 0}
              />
              <CloseButton onClick={props.deleteItem} name="members" data-inputid={memberId} className="input-close" />
            </div>
          </React.Fragment>)
        ))}

        <div className="extra-input-fields normal-margin-top">
          {props?.formData && props?.formData?.members?.error && props.error && <span className="input-additional-text red">
            {props?.formData?.members?.error}
          </span>}
        </div>
      </div>
    </>
  )
}

export default MemberInput