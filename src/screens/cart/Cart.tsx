import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SpaceComponent } from "../../components";
import LoadingOverlay from "../../components/LoadingOverLay";
import { convertTargetField } from "../../constants/convertTargetAndField";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { getDocData } from "../../constants/firebase/getDocData";
import { updateDocData } from "../../constants/firebase/updateDocData";
import { groupArrayWithField } from "../../constants/groupArrayWithField";
import {
  handleToastError,
  handleToastSuccess,
} from "../../constants/handleToast";
import { getCurrentMonth } from "../../constants/info";
import { functions } from "../../firebase.config";
import { PlanModel } from "../../models";
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useFieldStore,
  useInterventionStore,
  usePlanStore,
  useSelectNavbarStore,
  useTargetStore,
  useUserStore
} from "../../zustand";
import "./cart.css";

function GoalCartCard({ cart }: any) {
  const { fields } = useFieldStore();
  const { interventions } = useInterventionStore();
  const { targets } = useTargetStore();
  // const { suggests } = useSuggestStore();
  const { removeCart, editCart } = useCartStore();
  // const [type, setType] = useState("");
  // const [text, setText] = useState("");
  // const [suggest, setSuggest] = useState<SuggestModel>();

  // useEffect(() => {
  //   if (cart && cart.content) {
  //     setText(cart.content);
  //     const index = suggests.findIndex(
  //       (suggest) => suggest.name === cart.content,
  //     );
  //     if (index !== -1) {
  //       setSuggest(suggests[index]);
  //       setType("Gợi ý");
  //     } else {
  //       setType("Ý khác");
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cart]);

  // useEffect(() => {
  //   if (type === "Ý khác" && text) {
  //     editCart(cart.id, { ...cart, content: text });
  //   }
  //   if (type === "Gợi ý" && suggest) {
  //     editCart(cart.id, { ...cart, content: suggest.name });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [text, suggest]);

  const handleSelectIntervention = (val: string) => {
    editCart(cart.id, { ...cart, intervention: val });
  };
  // const handleSuggestsWithField = (fieldId: string) => {
  //   const items = suggests.filter((suggest) => suggest.fieldId === fieldId);
  //   return items;
  // };

  return (
    <article className="goal-cart-card">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div className="min-w-0">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className="goal-area">
              <i className="bi bi-flower2 me-1" />
              {convertTargetField(cart.targetId, targets, fields).nameField}
            </span>
            <span className="goal-level">Level: {cart.level}</span>

          </div>
          {/* <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="goal-area">
              <i className="bi bi-flower2 me-1" />
              {convertTargetField(cart.targetId, targets, fields).nameField}
            </span>

            <span className="goal-level">
              Level: {cart.level}
            </span>

            <select
              className="form-select form-select-sm intervention-select"
              value={cart.intervention}
              onChange={(e) => handleSelectIntervention(e.target.value)}
            >
              <option value="">Mức độ hỗ trợ</option>
              {interventions.map((item) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div> */}
          <h3 className="goal-title">{cart.name}</h3>
          <div className="goal-description-card">
            <div className="goal-description-label">
              <i className="bi bi-card-text me-2" />
              Mô tả
            </div>

            <div className="goal-description-content">
              {cart.content || "Chưa có mô tả cho mục tiêu này. Liên hệ Admin"}
            </div>
          </div>

          <div className="row g-2 mt-2">
            <div className="col-12 col-md-12">
              <select
                className="form-select"
                value={cart.intervention}
                onChange={(val) => handleSelectIntervention(val.target.value)}
              >
                <option value="">Chọn mức độ hỗ trợ</option>
                {interventions.map((_) => (
                  <option value={_.name} key={_.id}>
                    {_.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className="btn remove-btn"
          onClick={() => {
            removeCart(cart.id);
            deleteDocData({
              nameCollect: "carts",
              id: cart.id,
              metaDoc: "carts",
            });
          }}
          aria-label="Xóa mục tiêu"
        >
          <i className="bi bi-trash3-fill" />
        </button>
      </div>


      {/* <div className="d-flex flex-wrap align-items-center mb-2">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setType("Gợi ý")}
        >
          Gợi ý
        </button>
        <SpaceComponent width={10} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setType("Ý khác")}
        >
          Ý khác
        </button>
      </div> */}

      {/* <div>
        <SpaceComponent height={8} />
        {type === "Gợi ý" && (
          <Select<SuggestModel>
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id.toString()}
            options={handleSuggestsWithField(cart.fieldId)}
            maxMenuHeight={sizes.height}
            onChange={(val: SingleValue<SuggestModel>) =>
              setSuggest(val as SuggestModel)
            }
            value={suggest}
          />
        )}

        {type === "Ý khác" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-control"
            placeholder="Nhập đánh giá"
            rows={5}
            cols={400}
            id="floatingTextarea2"
          ></textarea>
        )}
      </div> */}
    </article>
  );
}

export default function GoalCartBootstrapGreen() {
  const navigate = useNavigate();
  const { setSelectNavbar } = useSelectNavbarStore();
  const { carts, setCarts } = useCartStore();
  const { addPlan, editPlan, plans } = usePlanStore();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { cartEdit, setCartEdit } = useCartEditStore(); // thực tế nó chỉ là planId thôi
  const [title, setTitle] = useState(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();

  useEffect(() => {
    if (carts.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [carts]);

  useEffect(() => {
    if (cartEdit) {
      getDocData({ id: cartEdit, nameCollect: "plans", setData: setPlan });
    }
  }, [cartEdit]);

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
    }
  }, [plan]);

  const handleSaveCart = () => {
    setIsLoading(true);
    const promiseItems = carts.map((cart) =>
      updateDocData({
        nameCollect: "carts",
        id: cart.id,
        valueUpdate: cart,
        metaDoc: "carts",
      }),
    );

    Promise.all(promiseItems)
      .then(() => {
        handleToastSuccess("Lưu nháp giỏ hàng thành công !");
      })
      .catch((error) => {
        handleToastError("Lưu nháp giỏ hàng thất bại !");
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleAddEditPlan = async () => {
    if (!user || !child) return;

    setIsLoading(true);

    try {
      if (!cartEdit) {
        const res: any = await httpsCallable(
          functions,
          "createPlanFromCarts",
        )({
          title,
          childId: child.id,
          carts,
        });

        addPlan({
          id: res.data.planId,
          type: "KH",
          title,
          childId: child.id,
          teacherIds: child.teacherIds,
          authorId: user.id,
          status: "pending",
          comment: "",
          updateById: user.id,
          createAt: Date.now(),
          updateAt: Date.now(),
        });

        handleToastSuccess("Thêm mới kế hoạch thành công !");
      } else {
        await httpsCallable(
          functions,
          "updatePlanFromCarts",
        )({
          planId: cartEdit,
          childId: child.id,
          carts,
        });

        const index = plans.findIndex((item) => item.id === cartEdit);

        if (index !== -1) {
          editPlan(cartEdit, {
            ...plans[index],
            updateById: user.id,
            updateAt: Date.now(),
          });
        }

        handleToastSuccess("Chỉnh sửa kế hoạch thành công !");
      }

      setCarts([]);
      setTitle("");
      setCartEdit(null);

      navigate("../pending");
      setSelectNavbar("pending");
    } catch (error) {
      console.log(error);
      handleToastError(
        cartEdit
          ? "Chỉnh sửa kế hoạch thất bại !"
          : "Thêm mới kế hoạch thất bại !",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Giỏ mục tiêu
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Kiểm tra, chỉnh sửa và tạo kế hoạch can thiệp tháng cho trẻ
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            <Link
              to={`../bank`}
              onClick={() => setSelectNavbar("bank")}
              className="btn action-btn-soft"
            >
              <i className="bi bi-bank2 me-2 icon-yellow" />
              Thêm mục tiêu từ ngân hàng
            </Link>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-9">
            {carts.length > 0 ? (
              <div className="row g-3 g-xl-4">
                {carts.length > 0 &&
                  groupArrayWithField(carts, "fieldId").map((cart) => (
                    <div className="col-12 col-lg-12" key={cart.id}>
                      <GoalCartCard cart={cart} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-cart">
                <i className="bi bi-cart3 fs-1 d-block mb-3 icon-yellow" />
                Không có mục tiêu phù hợp trong giỏ.
              </div>
            )}
          </div>

          <div className="col-12 col-xl-3">
            <aside className="create-plan-panel">
              <h3 className="h5 fw-black text-green-dark mb-3">
                {cartEdit ? "Chỉnh sửa" : "Tạo"} kế hoạch tháng
              </h3>

              <div className="mb-3">
                <div className="plan-field-label">Tháng kế hoạch</div>
                <select className="form-select filter-select">
                  <option
                    defaultValue={`${cartEdit ? plan?.title : getCurrentMonth()}`}
                  >
                    {cartEdit ? plan?.title : getCurrentMonth()}
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <div className="plan-preview-item">
                  <span>Tổng mục tiêu</span>
                  <span>{carts.length}</span>
                </div>
              </div>

              {!cartEdit && (
                <button
                  className="btn action-btn-soft w-100"
                  onClick={disable ? undefined : handleSaveCart}
                  disabled={disable}
                >
                  <i className="bi bi-save2-fill me-2 icon-yellow" />
                  Lưu nháp
                </button>
              )}
              <SpaceComponent height={10} />
              <button
                onClick={disable ? undefined : handleAddEditPlan}
                className="btn action-btn-primary w-100 mb-2"
                disabled={disable}
              >
                {cartEdit ? (
                  <>
                    <i className="bi bi-floppy-fill me-2" />
                    Lưu kế hoạch
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-check-fill me-2" />
                    Gửi kế hoạch chờ duyệt
                  </>
                )}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <LoadingOverlay show={isLoading} />
    </>
  );
}
