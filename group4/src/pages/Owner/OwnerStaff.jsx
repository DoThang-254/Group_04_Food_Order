import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
  Alert,
} from "react-bootstrap";
import "./styles/OwnerStaff.css";

const OwnerStaff = ({ staff, onAddStaff, onUpdateStaff, onDeleteStaff }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    active: true,
  });

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && member.active) ||
      (statusFilter === "inactive" && !member.active);
    return matchesSearch && matchesStatus;
  });

  const activeStaffCount = staff.filter((s) => s.active).length;
  const inactiveStaffCount = staff.filter((s) => !s.active).length;

  const handleShowModal = (staffMember = null) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: "", // Don't pre-fill password for security
        active: staffMember.active,
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      active: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const staffData = {
      ...formData,
      role: "staff",
    };

    if (editingStaff) {
      if (!formData.password) {
        delete staffData.password;
      }
      onUpdateStaff(editingStaff.id, staffData);
    } else {
      onAddStaff(staffData);
    }
    handleCloseModal();
  };

  const handleDelete = (staffId, staffName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staffName}"?`)) {
      onDeleteStaff(staffId);
    }
  };

  const handleToggleStatus = (staffMember) => {
    const action = staffMember.active ? "vô hiệu hóa" : "kích hoạt";
    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${action} tài khoản của "${staffMember.name}"?`
      )
    ) {
      onUpdateStaff(staffMember.id, { active: !staffMember.active });
    }
  };

  return (
    <div className="owner-staff">
      <div className="staff-header">
        <h3>Quản lý nhân sự</h3>
        <p className="text-muted">
          Quản lý nhân viên và phân quyền trong cửa hàng
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã vô hiệu hóa</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                onClick={() => handleShowModal()}
                className="w-100"
              >
                ➕ Thêm nhân viên
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Staff Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">{staff.length}</h4>
              <p className="stat-label">Tổng nhân viên</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card active-staff">
            <Card.Body className="text-center">
              <h4 className="stat-number text-success">{activeStaffCount}</h4>
              <p className="stat-label">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card inactive-staff">
            <Card.Body className="text-center">
              <h4 className="stat-number text-warning">{inactiveStaffCount}</h4>
              <p className="stat-label">Đã vô hiệu hóa</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Staff Table */}
      <Card>
        <Card.Header>
          <h5>👥 Danh sách nhân viên ({filteredStaff.length})</h5>
        </Card.Header>
        <Card.Body>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-4">
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h5>Không có nhân viên nào</h5>
                <p className="text-muted">
                  {searchTerm || statusFilter
                    ? "Không tìm thấy nhân viên phù hợp với bộ lọc"
                    : "Hãy thêm nhân viên đầu tiên cho cửa hàng của bạn"}
                </p>
                {!searchTerm && !statusFilter && (
                  <Button variant="primary" onClick={() => handleShowModal()}>
                    Thêm nhân viên đầu tiên
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Tên nhân viên</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th>Ngày tham gia</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>
                      <div className="staff-info">
                        <div className="staff-avatar">
                          {staffMember.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="staff-name">{staffMember.name}</div>
                      </div>
                    </td>
                    <td>{staffMember.email}</td>
                    <td>
                      <Badge bg={staffMember.active ? "success" : "warning"}>
                        {staffMember.active ? "Hoạt động" : "Vô hiệu hóa"}
                      </Badge>
                    </td>
                    <td>
                      {staffMember.createdAt
                        ? new Date(staffMember.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(staffMember)}
                          className="me-2"
                        >
                          ✏️ Sửa
                        </Button>
                        <Button
                          variant={
                            staffMember.active
                              ? "outline-warning"
                              : "outline-success"
                          }
                          size="sm"
                          onClick={() => handleToggleStatus(staffMember)}
                          className="me-2"
                        >
                          {staffMember.active ? "⏸️ Vô hiệu" : "▶️ Kích hoạt"}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleDelete(staffMember.id, staffMember.name)
                          }
                        >
                          🗑️ Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Staff Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStaff ? "✏️ Chỉnh sửa nhân viên" : "➕ Thêm nhân viên mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {!editingStaff && (
              <Alert variant="info">
                <small>
                  <strong>Lưu ý:</strong> Nhân viên mới sẽ được tạo với vai trò
                  "Staff" và có thể đăng nhập vào hệ thống.
                </small>
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Tên nhân viên *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đầy đủ"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Form.Text className="text-muted">
                Email này sẽ được sử dụng để đăng nhập vào hệ thống
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Mật khẩu {editingStaff ? "(Để trống nếu không thay đổi)" : "*"}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={
                  editingStaff ? "Nhập mật khẩu mới" : "Nhập mật khẩu"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingStaff}
                minLength="6"
              />
              <Form.Text className="text-muted">
                Mật khẩu tối thiểu 6 ký tự
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Tài khoản hoạt động"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              <Form.Text className="text-muted">
                Chỉ những tài khoản hoạt động mới có thể đăng nhập
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingStaff ? "Cập nhật" : "Thêm nhân viên"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default OwnerStaff;
