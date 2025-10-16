# NOTE: This is a template. Replace variables and review before applying.
# Creates OKE cluster and Autonomous Database (ATP)
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}

resource "oci_containerengine_cluster" "kubiciranje_oke" {
  compartment_id = var.compartment_ocid
  name           = "kubiciranje-oke"
}

resource "oci_database_autonomous_database" "kubiciranje_adb" {
  compartment_id = var.compartment_ocid
  display_name   = "kubiciranje-adb"
  db_name        = "KUBICIR"
  cpu_core_count = 1
  data_storage_size_in_gb = 20
  admin_password = var.autonomous_admin_password
  is_auto_scaling_enabled = false
  license_model = "LICENSE_INCLUDED"
}
